import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { query } from 'UTILS/graphql-query-helper';
import { toUpper, startCase, uniqBy, isEmpty} from 'lodash';
import config from 'ROOT/config';
import './production-report.less';

import ProductionSite from './production-site';

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
		let company = await query(config.api, 'companyOne', { code: toUpper(companyId) }, CompanyQuery);
		console.log('company', company);
		setCompany(company);
		return company;
	};

	const fetchSites = async (company) => {
		let ownerId = company.id;
		let sites = await query(config.api, 'siteMany', { owner: ownerId }, SiteQuery);
		console.log("sites", sites);
		setSites(sites);
		return sites;
	};

	const fetchInventories = async (company) => {
		let ownerId = company.id;
		let inventories = await query(config.api, 'storageSiteMany', { owner: ownerId, type: "STORE" }, InventoryQuerys);
		console.log('inventories', inventories);
		setInventories(inventories);
		return inventories;
	};

	const fetchProduction = async (company) => {
		let ownerId = company.id;
		let production = await query(config.api, 'productionLineMany', { owner: ownerId }, ProductionQuery);
		console.log('production', production);
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
			let timesPerDay = (24 / ((parseInt(line.orders[0].duration.millis) / (1000 * 60 * 60 * 24)) * 24));
			let siteId = line.siteId;
			let count = line.capacity;
			let id = line.id;
			let type = line.type;
			let workforce = line.workforce;
			let efficiency = parseFloat(line.effectivity);
			let siteName = getAddressStringFor(site.address);
			let outputs = line.orders.map((order) => {
				if (order.completed > 0 || order.recurring != true) {
					return "";
				};
				return order.outputs.map((output) => {
					let ticker = output.material.ticker;
					let amount = (output.amount * timesPerDay).toFixed(1);
					return {
						ticker,
						amount,
					};
				});
			}).filter(Boolean);

			if (outputs.length > count) {
				console.log("ERROR!!!");
			}

			let inputs = line.orders.map((order) => {
				if (order.completed > 0 || order.recurring != true) {
					return "";
				};
				timesPerDay = (24 / ((order.duration.millis / (1000 * 60 * 60 * 24)) * 24)).toFixed(3);
				return order.inputs.map((input) => {
					let ticker = input.material.ticker;
					let amount = (input.amount * timesPerDay).toFixed(1);
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

		let itemsToBurn = {};
		daily.map((line) => {

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

		let inventoryOutput = [];
		for (const [key, value] of Object.entries(itemsToBurn)) {
			let amountInInv = inventory?.items.find(item => item.quantity.material.ticker === key)?.quantity.amount || 0;
			if (value > 0) {
				inventoryOutput.push({ material: key, daysRemaining: "Growing at " + value.toFixed(1) + " per day", currentAmount: amountInInv});
			}
			else if (amountInInv === 0) {
				inventoryOutput.push({ material: key, daysRemaining: "0", currentAmount: amountInInv});
            }
			else if (value < 0) {
				let daysLeft = amountInInv / Math.abs(value);
				inventoryOutput.push({ material: key, daysRemaining: daysLeft.toFixed(1) + " days left", currentAmount: amountInInv });
			}
			else {
				inventoryOutput.push({ material: key, daysRemaining: "No change", currentAmount: amountInInv });
            }
		}

		let siteIds = _.uniqBy(daily, 'siteId').map((line) => { return line.siteId});

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

			<div>
				{reports.map(site => (
					<ProductionSite site={site} key={site.lines[0].siteId } />
				))}
			</div>
		</div>
	);

}