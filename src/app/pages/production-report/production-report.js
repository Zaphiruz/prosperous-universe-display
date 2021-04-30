import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { query } from 'UTILS/graphql-query-helper';
import { toUpper, startCase, uniqBy, isEmpty} from 'lodash';
import config from 'ROOT/config';
import './production-report.less';

import ProductionSite from './production-site';
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

const SiteQuery = {
	siteId: true,
	owner: {
		name: true,
		code: true,
		id: true,
	},
	//platforms: {
	//	name: true,
	//	area: true,
	//	condition: true,
	//	creationTime: {
	//		timestamp: true
	//	},
	//	lastRepair: {
	//		timestamp: true
	//	},
	//},
	address: {
		type: true,
		entity: {
			name: true,
		}
    },
}

const InventoryQuerys = {
	type: true,
	items: {
		id: true,
		quantity: {
			amount: true,
			material: {
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

const ProductionQuery = {
	id: true,
	owner: true,
	siteId: true,
	type: true,
	capacity: true,
	slots: true,
	efficiency: true,
	condition: true,
	workforces: {
		level: true,
		efficiency: true,
	},
	orders: {
		completed: true,
		completion: true,
		created: {
			timestamp: true
		},
		duration: {
			millis: true
		},
		halted: true,
		inputs: {
			amount: true,
			value: {
				amount: true,
				currency: true,
            },
			material: {
				_id: true,
				name: true,
				ticker: true,
				volume: true,
				weight: true,
				category: {
					name: true
				}
			}
		},
		outputs: {
			amount: true,
			value: {
				amount: true,
				currency: true,
			},
			material: {
				id: true,
				name: true,
				ticker: true,
				volume: true,
				weight: true,
				category: {
					name: true
				}
			}
		},
		productionFee: {
			amount: true,
			currency: true
		},
		productionLineId: true,
		recurring: true,
		started: true,
	},
	productionTemplates: {
		duration: {
			millis: true
		},
		efficiency: true,
		effortFactor: true,
		id: true,
		inputFactors: {
			factor: true,
			material: {
				id: true,
				name: true,
				ticker: true,
				volume: true,
				weight: true,
				category: {
					name: true
				}
			}
		},
		outputFactors: {
			factor: true,
			material: {
				id: true,
				name: true,
				ticker: true,
				volume: true,
				weight: true,
				category: {
					name: true
                }
			}
		},
		productionFeeFactor: {
			amount: true,
			currency: true
		}
	},
	efficiencyFactors: {
		effectivity: true,
		expertiseCategory: true,
		type: true,
		value: true		
    }
};

export default () => {
	let { companyId } = useParams();
	let [company, setCompany] = useState({});
	let [inventories, setInventories] = useState([]);
	let [production, setProduction] = useState([]);
	let [sites, setSites] = useState([]);
	let [reports, setReports] = useState([]);

	const fetchCompany = async () => {
		let company = await query(config.api, 'companyOne', { filter: { code: toUpper(companyId) } }, CompanyQuery);
		//console.log('company', company);
		setCompany(company);
		return company;
	};

	const fetchSites = async (company) => {
		let ownerId = company.id;
		let sites = await query(config.api, 'siteMany', { filter: { owner: ownerId } }, SiteQuery);
		//console.log("sites", sites);
		setSites(sites);
		return sites;
	};

	const fetchInventories = async (company) => {
		let ownerId = company.id;
		let inventories = await query(config.api, 'storageSiteMany', { filter: { owner: ownerId, type: "STORE" } }, InventoryQuerys);
		//console.log('inventories', inventories);
		setInventories(inventories);
		return inventories;
	};

	const fetchProduction = async (company) => {
		let ownerId = company.id;
		let production = await query(config.api, 'productionLineMany', { filter: { owner: ownerId } }, ProductionQuery);
		//console.log('production', production);

		production = production.map((line) => {
			let countOfActiveOrders = 0;
			line.orders.map((order) => {
				if (order.completed > 0) {
					countOfActiveOrders += 1;
				}
			});

			if (countOfActiveOrders < line.capacity) {
				let orders = [];
				for (var i = 0; i < line.orders.length; i++) {
					if (i > line.capacity - 1) {
						orders.push(line.orders[i]);
                    }
				}

				line.orders = orders;
            }

			return line;
		});
		//console.log('post production', production);
		setProduction(production);
		return production;
	};

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

	const correlate = ([inventories, productionLines, sites]) => {
		let pairs = sites.map((site) => {
			let siteId = site.siteId;
			let inventory = inventories.find(inv => inv.addressableId.siteId === siteId);
			let productionLine = productionLines.filter(line => line.siteId === siteId);
			return {
				site,
				siteId,
				productionLine,
				inventory,
			};
		});

		return pairs;
	};

	const reportForLocation = ({ site, siteId, productionLine, inventory }) => {

		let daily = productionLine.map((line) => {
			let siteId = line.siteId;
			let siteName = getAddressStringFor(site.address);
			let id = line.id;
			let type = line.type;
			let workforce = line.workforce;
			let efficiency = parseFloat(line.effectivity);
			let count = line.capacity;

			let timesPerDay = null;
			let utilization = null;
			let outputs = null;
			let inputs = null;

			if (line.orders.length < 1) {
				return {
					siteId,
					siteName,
					id,
					type,
					workforce,
					efficiency,
					timesPerDay,
					count,
					outputs,
					inputs,
				}
            }

			outputs = line.orders.map((order) => {
				if (order.completed > 0 || order.recurring != true) {
					return "";
				};

				timesPerDay = (24 / ((parseInt(order.duration.millis) / (1000 * 60 * 60 * 24)) * 24));

				return order.outputs.map((output) => {
					let ticker = output.material.ticker;
					let amount = (output.amount * timesPerDay * count).toFixed(1);
					return {
						ticker,
						amount,
					};
				});
			}).filter(Boolean);

			// Check to see if we're getting more outputs than there are buildings. Happens if the items being produced don't show up as having a completion percent
			if (outputs.length > count) {
				console.log("ERROR!!!");
			}

			inputs = line.orders.map((order) => {
				if (order.completed > 0 || order.recurring != true) {
					return "";
				};
				timesPerDay = (24 / ((parseInt(order.duration.millis) / (1000 * 60 * 60 * 24)) * 24)).toFixed(3);
				return order.inputs.map((input) => {
					let ticker = input.material.ticker;
					let amount = (input.amount * timesPerDay * count).toFixed(1);
					console.log("!");
					return {
						ticker,
						amount,
					};
				});
			}).filter(Boolean);

			return {
				siteId,
				siteName,
				id,
				type,
				workforce,
				efficiency,
				timesPerDay,
				count,
				outputs,
				inputs,
			}
		});

		console.log("daily", daily);

		let itemsToBurn = {};
		daily.map((line) => {
			console.log("line", line);
			line.inputs.map((input) => {
				input.map((item) => {
					if (item.ticker in itemsToBurn)
						itemsToBurn[item.ticker] -= parseFloat(item.amount);
					else {
						itemsToBurn[item.ticker] = -parseFloat(item.amount);
					}
				});
			});
			line.outputs.map((output) => {
				output.map((item) => {
					if (item.ticker in itemsToBurn)
						itemsToBurn[item.ticker] += parseFloat(item.amount);
					else {
						itemsToBurn[item.ticker] = parseFloat(item.amount);
					}
				});
			});
		});

		console.log("itemsToBurn", itemsToBurn);

		let inventoryOutput = [];
		for (const [key, value] of Object.entries(itemsToBurn)) {
			let amountInInv = inventory?.items.find(item => item.quantity.material.ticker === key)?.quantity.amount || 0;
			if (value > 0) {
				inventoryOutput.push({ material: key, daysRemaining: "Growing at " + value.toFixed(1) + " per day", currentAmount: amountInInv });
			}
			else if (amountInInv === 0) {
				inventoryOutput.push({ material: key, daysRemaining: "0", currentAmount: amountInInv });
			}
			else if (value < 0) {
				let daysLeft = amountInInv / Math.abs(value);
				inventoryOutput.push({ material: key, daysRemaining: daysLeft.toFixed(1) + " days left", currentAmount: amountInInv });
			}
			else {
				inventoryOutput.push({ material: key, daysRemaining: "No change", currentAmount: amountInInv });
			}
		}

		let siteIds = _.uniqBy(daily, 'siteId').map((line) => { return line.siteId });

		let sites = siteIds.map((site) => {
			let lines = daily.filter((line) => {
				return line.siteId === site;
			});
			let inventories = {};
			return {
				lines,
				inventories,
				inventoryOutput,
			}
		});

		console.log("sites", sites);

		return sites;
	};

	useEffect(async () => {
		let company = await fetchCompany();
		let datas = await Promise.all([
			fetchInventories(company),
			fetchProduction(company),
			fetchSites(company),
		]);
		let reports = correlate(datas)
			.map(reportForLocation)
		setReports(reports[0]);
	}, []);

	return (
		<div className='consuption-report container mx-auto p-3'>
			<div>
				<h1 className='text-xl capitalize inline-block'>Production report - page loading...</h1>
			</div>

			<div>
				<small>Please note: This is only working on reoccuring orders only at the moment...</small>
			</div>

			{reports.length && (
				<div>
					{reports.map(site => (
						<ProductionSite site={site} key={site.lines[0].siteId} />
					))}
				</div>
			) || (
				<Loading />
			)}
		</div>
	);
};