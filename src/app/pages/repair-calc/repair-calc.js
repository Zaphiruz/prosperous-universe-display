import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { query } from 'UTILS/graphql-query-helper';
import { toUpper, startCase, toLower, isEmpty, uniq, sumBy } from 'lodash';
import config from 'ROOT/config';
import './repair-calc.less';

import Button from 'COMPONENTS/button';
import { MarketSelector, MarketToCurrency, CurrecyToMarket } from 'COMPONENTS/currency-market-selectors';
import CompanyBadge from 'COMPONENTS/company-badge';

//#region queries
const CompanyQuery = {
	id: true,
	name: true,
	code: true,
	ownCurrency: {
		code: true
	},
	ratingReport: {
		overallRating: true,
		subRatings: {
			rating: true,
			score: true
		}
	}
};

const SiteQuery = {
	siteId: true,
	platforms: {
		condition: true,
		repairMaterials: {
			amount: true,
			material: {
				ticker: true
			}
		},
		module: {
			reactorTicker: true
		}
	},
	address: {
		type:true,
		entity: {
			name: true,
			naturalId: true
		}
	}
}

const CxQuery = {
	priceAverage: {
		amount: true,
		currency: true
	},
	material: {
		ticker: true
	}
}
//#endregion

// TODO: pull into util for general use
const getAddressStringFor = (addresses) => {
	if (isEmpty(addresses)) {
		return '';
	}

	let planet = addresses.find(entity => entity.type === 'PLANET');
	let system = addresses.find(entity => entity.type === 'SYSTEM');

	return planet?.entity.name
		? startCase(planet?.entity.name) + " - " + startCase(system?.entity.name || system?.entity.naturalId)
		: startCase(planet?.entity.naturalId || system?.entity.naturalId)
}

export default () => {
	let { companyId } = useParams();
	let [ company, setCompany ] = useState({});
	let [ sites, setSites ] = useState([]);
	let [ threshhold, setThreshold ] = useState(.95);
	let [ market, setMarket ] = useState('NC1');
	let [ filteredSites, setFilteredSites ] = useState([]);
	let [ pricesCache, setPricesCache ] = useState([]);
	let threshholdInput = useRef('95');
	let marketSelector = useRef('NC1');

	const fetchCompany = async () => {
		let company = await query(config.api, 'companyOne', { filter: { code: toUpper(companyId) }}, CompanyQuery);
		setCompany(company);
		return company;
	}

	const fetchSites = async (company) => {
		let sites = await query(config.api, 'siteMany', { filter: { owner: toLower(company.id) }}, SiteQuery);
		setSites(sites);
		return sites;
	}

	const filterByThreshold = () => {
		let filteredSitePlatforms = sites.map(site => {
			return {
				...site,
				platforms: site.platforms.filter(building => building.condition < threshhold)
			}
		})
		setFilteredSites(filteredSitePlatforms);
		return filteredSitePlatforms;
	}

	const fetchPrices = async (totaledSites, market) => {
		let allMaterials = totaledSites.flatMap(site => site.totalMaterials.map(item => `${item.ticker}.${market}`));
		let materialsToFetch = uniq(allMaterials).filter(ticker => !pricesCache.some(item => `${item.material.ticker}.${CurrecyToMarket[item.priceAverage.currency]}` === ticker)); // only fetch stuff that hasnt been fetched

		if (!materialsToFetch.length) {
			return pricesCache;
		}

		let prices = await query(config.api, 'cxBrokerMany', { filter: { tickers: materialsToFetch } }, CxQuery);
		let newPricesCache = [...pricesCache, ...prices];
		setPricesCache(newPricesCache);
		return newPricesCache;
	}

	const sumMaterialsForSite = (filteredSites) => {
		let totaledSites = filteredSites.map(site => {
			let totals = site.platforms.reduce(({ totalMaterials, totalBuildings }, building) => {
				// building counts
				let prevousEntry = totalBuildings.find(obj => obj.ticker === building.module.reactorTicker);
				if (!prevousEntry) {
					prevousEntry = {
						ticker: building.module.reactorTicker,
						amount: 0
					};
					totalBuildings.push(prevousEntry);
				}
				prevousEntry.amount++;

				// material counts
				for (let { amount, material } of building.repairMaterials) {
					let ticker = material?.ticker;
					let prevousEntry = totalMaterials.find(obj => obj.ticker === ticker);
					if (!prevousEntry) {
						prevousEntry = {
							ticker,
							amount: 0
						};
						totalMaterials.push(prevousEntry);
					}

					prevousEntry.amount += amount;
				}

				return { totalMaterials, totalBuildings };
			}, { totalMaterials: [], totalBuildings: [] });

			return {
				...site,
				...totals
			};
		});

		setFilteredSites(totaledSites);
		return totaledSites;
	}

	const assignPrices = (filteredSites, prices, market) => {
		let pricedSites = filteredSites.map(site => {
			let totalPrice = site.totalMaterials.map(({ ticker, amount }) => {
				let priceData = prices.find(price => price.material.ticker === ticker && price.priceAverage.currency === MarketToCurrency[market]);
				let currency = priceData?.priceAverage.currency;
				let cost = (priceData?.priceAverage.amount * amount).toFixed(2)

				return {
					ticker,
					amount,
					cost,
					currency
				}
			})

			return {
				...site,
				totalMaterials: totalPrice
			}
		})

		setFilteredSites(pricedSites);
		return pricedSites;
	}

	useEffect(async () => {
		let company = await fetchCompany();
		let sites = await fetchSites(company);
	}, []);

	useEffect(async () => {
		let filteredSitePlatforms = filterByThreshold();
		let totaledSites = sumMaterialsForSite(filteredSitePlatforms);
		let prices = await fetchPrices(totaledSites, market);
		let pricedSites = assignPrices(totaledSites, prices, market);
	}, [sites, threshhold, market]);

	const adjustThreshhold = (e) => {
		e.preventDefault();
		e.stopPropagation();

		let threshholdValue = threshholdInput.current.value.trim();
		let threshhold = (parseInt(threshholdValue)/100).toFixed(2)
		setThreshold(threshhold);

		let market = marketSelector.current.value;
		setMarket(market);
	}

	return (
		<section className='repair-calc container mx-auto p-3'>
			<CompanyBadge company={company} className='block pb-3'/>

			<form onSubmit={adjustThreshhold}>
				<label htmlFor='conditionTreshhold'>Condition Threshhold</label>
				<input type='text'
					id='conditionTreshhold'
					ref={threshholdInput}
					defaultValue={threshhold * 100}
					pattern='\s*(100|\d{1,2})\s*'
					placeholder='i.e. 100'
					title="Count should only be positive, whole numbers between 0 and 100 i.e. 1, 55, 100,"
				/>

				<MarketSelector ref={marketSelector} id="repair-calc"/>

				<Button type='submit'
					className='flex justify-center items-center whitespace-nowrap bg-blue-700 bg-opacity-30 focus:text-bold focus:bg-opacity-100'
				>
					Apply
				</Button>
			</form>

			<div>
				{filteredSites.map(site => (
					<div key={"filteredSites-" + site.siteId} className='bg-gray-400 dark:bg-gray-800 p-3 rounded-md my-4'>
						<small className='text-gray-500 dark:text-gray-400 mr-2'>{site.siteId}</small>
						<h3 className='text-lg capitalize inline-block'>{getAddressStringFor(site.address)}</h3>
			
						<div className='grid grid-flow-row grid-cols-3 md:grid-cols-4 lg:gird-cols-6 gap-2 mt-1 mb-2'>
							{site.totalMaterials.length && (site.totalMaterials.map(({ticker, amount, cost, currency}) => (
								<div key={"totalRepairMaterial-"+ticker}>
									<p>Material: {ticker}</p>
									<p>Amount: {amount}</p>
									<p>Cost: {new Intl.NumberFormat().format(cost)} {currency}</p>
								</div>
							))) || (
								<p>No Repairs Needed</p>
							)}
						</div>

						<div className="my-2">
							<strong>Total: {new Intl.NumberFormat().format(
								sumBy(site.totalMaterials, ({cost}) => { 
									return parseFloat(cost)
								})
									.toFixed(2)
							)} {site.totalMaterials[0]?.currency}</strong>
						</div>
						
						
						<hr className='opacity-30'/>
						<div className='grid grid-flow-row grid-cols-5 md:grid-cols-7 lg:gird-cols-10 gap-2 mt-1'>
							{site.totalBuildings.map(({ticker, amount}) => (
								<div key={"totalBuildings-"+ticker}>
									<small className='text-gray-500 dark:text-gray-400 mr-2'>{ticker} x{amount}</small>
								</div>
							))}
						</div>
				</div>
				))}
			</div>
		</section>
	);
}