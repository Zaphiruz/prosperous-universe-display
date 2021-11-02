import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { query } from 'UTILS/graphql-query-helper';
import { toUpper, startCase } from 'lodash';
import config from 'ROOT/config';
import './consumption-report.less';

import ConsumtionSite from './consumption-site';
import Loading from 'COMPONENTS/loading';

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

const WorkForceQuery = {
	workforces: {
		capacity: true,
		level: true,
		population: true,
		reserve: true,
		satisfaction: true,
		needs: {
			needs: {
				essential: true,
				material: {
					id: true,
					ticker: true,
					name: true
				},
				unitsPer100: true
			}
		}
	},
	siteId: {
		siteId: true,
		address: {
			type:true,
			entity: {
				name: true,
				naturalId: true
			}
		}
	},
	updatedAt: true,
};

const InventoryQuerys = {
	type: true,
	items: {
		id: true,
		quantity: {
			amount: true,
			material : {
				id: true,
				ticker: true, 
				name: true,
			}
		}
	},
	addressableId: {
		siteId: true
	}
}

export default () => {
	let { companyId } = useParams();
	let [ company, setCompany ] = useState({});
	let [ workforces, setWorkforces ] = useState([]);
	let [ inventories, setInventories ] = useState([]);
	let [ reports, setReports ] = useState([]);

	const fetchCompany = async () => {
		let company = await query(config.api, 'companyOne', { filter: { code: toUpper(companyId) }}, CompanyQuery);
		console.log('company', company)
		setCompany(company);
		return company;
	}

	const fetchWorkforces = async (company) => {
		let ownerId = company.id;
		let workforces = await query(config.api, 'workforceMany', { filter: { owner: ownerId } }, WorkForceQuery);
		console.log('workforces', workforces)
		setWorkforces(workforces);
		return workforces;
	}

	const fetchInventories = async (company) => {
		let ownerId = company.id;
		let inventories = await query(config.api, 'storageSiteMany', { filter: { owner: ownerId, type: "STORE" }}, InventoryQuerys);
		console.log('inventories', inventories)
		setInventories(inventories);
		return inventories;
	}

	const correlate = ([workforces, inventories]) => {
		let pairs = workforces.map((workforce) => {
			let siteId = workforce.siteId.siteId;
			let inventory = inventories.find(inv => inv.addressableId.siteId === siteId);
			return {
				address: workforce.siteId.address,
				siteId,
				workforce,
				inventory
			}
		});

		return pairs;
	}

	const reportForLocation = ({ workforce, inventory, address, siteId }) => {
		let workforces = workforce.workforces;
		let updatedAt = workforce.updatedAt;
		let needslists = workforces.map((force) => {
			let population = force.population;

			return force.needs.needs.map(need => {
				let { essential, material, unitsPer100 } = need;
				let unitsPerInterval = population * (unitsPer100 / 100);

				return {
					essential,
					material,
					unitsPerInterval
				}
			})
		})

		let masterNeedList = needslists.reduce((acc, needList) => {
			for (let need of needList) {
				if (need.unitsPerInterval === 0) continue;

				let prevNeed = acc.find(prevNeed => prevNeed.material.id === need.material.id);
				if (prevNeed) {
					prevNeed.unitsPerInterval += need.unitsPerInterval;
				} else {
					acc.push(need);
				}
			}

			return acc;
		}, [])

		let needs = masterNeedList.map((need) => {
			let materialId = need.material.id;
			let amountInInv = inventory?.items.find(item => item.id === materialId)?.quantity.amount || 0;
			let intervalsSatisfied = amountInInv / need.unitsPerInterval;

			return {
				...need,
				amountInInv,
				intervalsSatisfied
			}
		})

		return {
			address,
			siteId,
			needs,
			updatedAt,
		}
	}

	useEffect(async () => {
		let company = await fetchCompany();
		let datas = await Promise.all([
			fetchWorkforces(company),
			fetchInventories(company)
		]);
			let reports = correlate(datas)
				.map(reportForLocation)
			setReports(reports);
	}, []);

	return (
		<div className='consuption-report container mx-auto p-3'>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>{toUpper(company?.code)}</small>
			<h1 className='text-xl capitalize inline-block'>{startCase(company?.name)}</h1>

			{reports.length && (
				<div>
					{reports.map(site => (
						<ConsumtionSite site={site} key={site.siteId} />
					))}
				</div>
			) || (
				<Loading />
			)}
		</div>
	);
};
