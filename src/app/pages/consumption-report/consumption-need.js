import React from 'react';
import { startCase } from 'lodash'

export default ({ need }) => {

	const getBgColors = () => {
		switch(true) {
			case need.intervalsSatisfied < 1:
				return `bg-red-700 dark:bg-red-900`;

			case need.intervalsSatisfied < 3:
				return `bg-yellow-400 dark:bg-yellow-700`;

			case need.intervalsSatisfied > 5:
				return `bg-green-400 dark:bg-green-700`;
			
			default:
				return `bg-gray-400 dark:bg-gray-800`
		}
	}

	return (
		<div className={`p-2 rounded-md ${getBgColors()}`}>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>{need.material.ticker}</small>
			<h4>{startCase(need.material.name)}</h4>
			<dl>
				<dt>Essential:</dt>
				<dd>{String(need.essential)}</dd>

				<dt>Amount on Site:</dt>
				<dd>{need.amountInInv}</dd>

				<dt>Consumed per day:</dt>
				<dd>{need.unitsPerInterval}</dd>

				<dt>Days until hunger strikes:</dt>
				<dd>{need.intervalsSatisfied.toFixed(2)}</dd>
			</dl>
		</div>
	)
}