import React from 'react';
import { startCase } from 'lodash'

import ProductionOutput from './production-output';
import ProductionNeed from './production-need';

export default ({ line }) => {

	return (
		<div className={`p-2 rounded-md bg-gray-400 dark:bg-gray-800`}>
			<h3 className='text-gray-500 dark:text-gray-400 mr-2'>{line.type}</h3>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>X{line.capacity}</small>

			<div>
				<ProductionOutput orders={line.orders} key={line.id + ".orders"} />
				<ProductionNeed line={line} key={line.id + ".need"} />
			</div>
		</div>
	)
}