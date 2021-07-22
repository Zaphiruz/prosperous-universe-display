import React from 'react';
import { toUpper, startCase } from 'lodash';

export default ({ company, className }) => (
	<span className={className}>
		<small className='text-gray-500 dark:text-gray-400 mr-2'>{toUpper(company?.code)}</small>
		<h1 className='text-xl capitalize inline-block'>{startCase(company?.name)}</h1>
	</span>
)
