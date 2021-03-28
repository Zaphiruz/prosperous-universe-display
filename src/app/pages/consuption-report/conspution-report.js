import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { query } from 'UTILS/graphql-query-helper';
import { toUpper, startCase } from 'lodash';
import config from 'ROOT/config';
import './consuption-report.less';

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
		required: true,
		satisfaction: true,
		needs: {
			needs: {
				essential: true,
				material: {
					ticker: true,
					name: true
				}
			}
		}
	},
	siteId: {
		siteId: true,
		address: {
			name: true,
			naturalId: true
		}
	}
};

const InventoryQuerys = {
	type: true,
	items: {
		quantity: {
			amount: true,
			material : {
				ticker: true, 
				name: true,
			}
		}
	},
	addressableId: true
}

export default () => {
	let { companyId } = useParams();
	let [ company, setCompany ] = useState({});
	let [ workforces, setWorkforces ] = useState([]);
	let [ inventories, setInventories ] = useState([]);

	const fetchCompany = async () => {
		let company = await query(config.api, 'companyOne', { code: toUpper(companyId) }, CompanyQuery);
		console.log('company', company)
		setCompany(company);
		return company;
	}

	const fetchWorkforces = async (company) => {
		let ownerId = company.id;
		let workforces = await query(config.api, 'workforceMany', { owner: ownerId }, WorkForceQuery);
		console.log('workforces', workforces)
		setWorkforces(workforces);
		return workforces;
	}

	const fetchInventories = async (company) => {
		let ownerId = company.id;
		let inventories = await query(config.api, 'storageMany', { owner: ownerId, type: "STORE" }, InventoryQuerys);
		console.log('inventories', inventories)
		setInventories(inventories);
		return inventories;
	}

	const correlate = ([workforces, inventories]) => {
		// debugger;
	}

	useEffect(async () => {
		let company = await fetchCompany();
		let datas = await Promise.all([
			fetchWorkforces(company),
			fetchInventories(company)
		]);

		correlate(datas);
	}, []);

	return (
		<div className='consuption-report container mx-auto'>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>{toUpper(company?.code)}</small>
			<h1 className='text-xl capitalize inline-block'>{startCase(company?.name)}</h1>
		</div>
	);
};
