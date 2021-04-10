import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { toUpper, startCase } from 'lodash';
import { query } from 'UTILS/graphql-query-helper';
import config from 'ROOT/config';

import Button from 'COMPONENTS/button';
import Loading from 'COMPONENTS/loading';

const CompanyQuery = {
	name: true,
	code: true,
};

export default () => {
	const [companies, setCompanies] = useState([]);
	const [redirectToCompany, setRedirectToCompany] = useState('');
	const selectedCompany = useRef('');

	const fetchCompanies = async () => {
		let companies = await query(config.api, 'companyMany', null, CompanyQuery);
		setCompanies(companies);
	}

	const navigateToReport = (e) => {
		e.preventDefault();
		e.stopPropagation();

		setRedirectToCompany(selectedCompany.current.value);
	}

	useEffect(async () => {
		await fetchCompanies();
	}, [])

	if (redirectToCompany) {
		return <Redirect push to={`/consumption-report/${redirectToCompany}`}/>
	}

	return (
		<div className='container mx-auto'>
			<h1 className='text-lg'>Select a Company</h1>

			{companies.length && (
				<form onSubmit={navigateToReport}>
					<label htmlFor='company-selection'>Company</label>
					<select
						id='company-selection'
						ref={selectedCompany}
						required="required"
					>
						<option className='dark:bg-gray-900 dark:text-white' value=''>Select</option>
		
						{companies.map(company => (
							<option
								className='dark:bg-gray-900 dark:text-white'
								value={toUpper(company.code)} key={company.code}
							>
								{toUpper(company.code)} - {startCase(company.name)}
							</option>
						))}
					</select>

					<Button type='submit'
						className="bg-blue-500 dark:bg-blue-700 bg-opacity:30 focus:text-bold focus:bg-opacity-100 ml-3"
					>
						GO!
					</Button>
				</form>
			) || (
				<Loading />
			)}
		</div>
	);
};
