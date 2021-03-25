import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { query } from 'UTILS/graphql-query-helper';
import './consuption-report.less';

const CompanyQuery = {
	id: true,
	name: true,
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
			essential: true,
			material: {
				ticker: true,
				name: true
			}
		}
	},
	siteId: {
		address: {
			name: true,
			naturalId: true
		}
	}
};

export default () => {
	let { companyId } = useParams();
	let { company, setCompany } = useState({});
	let { workforces, setWorkforces } = useState([]);
	let { inventories, setInventories } = useState([]);

	const fetchCompany = async () => {
		let company = await query('https://api.prosperon.app/graphql', 'companyOne', { code: companyId }, CompanyQuery);
		setCompany(company);
	}

	const fetchWorkforces = async () => {
		let ownerId = company.owner?.id;
		let workforces = await query('https://api.prosperon.app/graphql', 'workforceMany', { owner: ownerId }, WorkForceQuery);
		setWorkforces(workforces);
	}

	const fetchInventories = async () => {
		let ownerId = company.owner?.id;
		let inventories = await query('https://api.prosperon.app/graphql', 'storageMany', { owner: ownerId, type: "STORE" }, WorkForceQuery);
		setInventories(inventories);
	}

	useEffect(async () => {
		await fetchCompany();
		await Promise.all([
			fetchWorkforces(),
			fetchInventories()
		]);
	}, []);

	return (
		<div className='consuption-report container mx-auto'>
			<h1>{ id }</h1>
		</div>
	);
};
