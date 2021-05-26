import React from 'react';
import { startCase, isEmpty } from 'lodash'

import ProductionLine from './production-line';
import ProductionInventory from './production-inventory';

export default ({ site }) => {
	return (
		<div className='bg-gray-400 dark:bg-gray-800 p-2 rounded-md my-4'>
			<h3 className='text-lg capitalize inline-block'>{site.lines[0].siteName} &nbsp;</h3>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>{site.lines[0].siteId} {('updatedAt' in site ? " - Updated: " + new Date(site.updatedAt).toLocaleDateString() : '')}</small>

			<div className='grid grid-flow-row grid-cols-2 gap-2 mt-1'>
				{site.lines.map((line) => (
					<ProductionLine line={line} key={line.id} />
				))}
			</div>

			<div>
				<h3>Effect on Inventory</h3>
				<ProductionInventory inventoryOutput={site.inventoryOutput} key={site.lines[0].siteId + "invOutput"}/>
			</div>
		</div>
	);
}