import React from 'react';
import { startCase } from 'lodash'

export default ({ need }) => {

	const getBgColors = () => {
		switch(true) {
			case need.intervalsSatisfied < 1:
				return `bg-red-700 dark:bg-red-900 bg-opacity-30 dark:bg-opacity-80`;

			case need.intervalsSatisfied < 3:
				return `bg-yellow-400 dark:bg-yellow-700 bg-opacity-30 dark:bg-opacity-80`;

			case need.intervalsSatisfied > 5:
				return `bg-green-400 dark:bg-green-700 bg-opacity-30 dark:bg-opacity-80`;
			
			default:
				return `bg-gray-500 dark:bg-gray-700 bg-opacity-30 dark:bg-opacity-80`
		}
	}

	return (
		<div className={`p-2 rounded-md ${getBgColors()}`}>
			<small className='text-gray-500 dark:text-gray-300 mr-2'>{need.material.ticker}</small>
			<h4 className='text-lg capitalize inline-block'>{startCase(need.material.name)}</h4>
			
			<dl className='lg:flex justify-between'>
				<div className='m-1'>
					<dt>Essential:</dt>
					<dd>{String(need.essential)}</dd>
				</div>
				
				<div className='m-1'>
					<dt>Amount on Site:</dt>
					<dd>{need.amountInInv}</dd>
				</div>

				<div className='m-1'>
					<dt>Consumed per day:</dt>
					<dd>{need.unitsPerInterval.toFixed(2)}</dd>
				</div>
				

				<div className='m-1'>
					<dt>Days until worker strikes:</dt>
					<dd>{need.intervalsSatisfied.toFixed(2)}</dd>
				</div>
			</dl>
		</div>
	)
}