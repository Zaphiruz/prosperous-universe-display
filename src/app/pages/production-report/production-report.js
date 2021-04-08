import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { query } from 'UTILS/graphql-query-helper';
import { toUpper, startCase } from 'lodash';
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

		return {
			siteId,
			productionLine,
			site,
			inventory,
		};
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
		setReports(reports);
	}, []);

	return (
		<div className='consuption-report container mx-auto p-3'>
			<h1 className='text-xl capitalize inline-block'>Production report - page loading...</h1>

			<div>
				{reports.map(site => (
					<ProductionSite site={site} key={site.siteId } />
				))}
			</div>
		</div>
	);

}