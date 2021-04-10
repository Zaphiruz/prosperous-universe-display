import React from 'react';
import { capitalize, isEmpty } from 'lodash'

import ProductionLine from './production-line';

const getAddressStringFor = (addresses) => {
	if (isEmpty(addresses)) {
		return '';
	}

	let planet = addresses.find(entity => entity.type === 'PLANET');
	let system = addresses.find(entity => entity.type === 'SYSTEM');

	return planet?.entity.name
		? capitalize(planet?.entity.name) + " - " + capitalize(system?.entity.name || system?.entity.naturalId)
		: capitalize(planet?.entity.naturalId || system?.entity.naturalId)
}

export default ({ site }) => {
	return (
		<div className='bg-gray-400 dark:bg-gray-800 p-2 rounded-md my-4'>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>{site.siteId}</small>
			<h3 className='text-lg capitalize inline-block'>{getAddressStringFor(site.site.address)}</h3>

			<div className='grid grid-flow-row grid-cols-2 gap-2 mt-1'>
				{site.productionLine.map((line) => (
					<ProductionLine line={line} key={line.id} />
				))}
			</div>

		</div>
	);
}