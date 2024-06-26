import React from 'react';
import { startCase, isEmpty } from 'lodash'

import ConsumptionNeed from './consumption-need';

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

export default ({ site }) => {
	return (
		<div className='bg-gray-400 dark:bg-gray-800 p-2 rounded-md my-4'>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>{site.siteId}</small>
			<h3 className='text-lg capitalize inline-block'>{getAddressStringFor(site.address)}</h3>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>{("updatedAt" in site && site.updatedAt ? " - Updated: " + new Date(site.updatedAt).toLocaleDateString() : "" )}</small>

			<div className='grid grid-flow-row grid-cols-2 gap-2 mt-1'>
				{site.needs.map((need) => (
					<ConsumptionNeed need={need} key={need.material.id} />
				))}
			</div>
		</div>
	);
}