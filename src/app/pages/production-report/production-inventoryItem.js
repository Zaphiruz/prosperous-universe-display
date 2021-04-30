import React from 'react';
import { startCase } from 'lodash';

export default ({ inventoryItem }) => {

	const getBgColors = () => {
		switch (true) {
			case inventoryItem.daysRemaining < 1:
				return `bg-red-700 dark:bg-red-900 bg-opacity-30 dark:bg-opacity-80`;

			case inventoryItem.daysRemaining < 3:
				return `bg-yellow-400 dark:bg-yellow-700 bg-opacity-30 dark:bg-opacity-80`;

			case inventoryItem.daysRemaining > 5:
				return `bg-green-400 dark:bg-green-700 bg-opacity-30 dark:bg-opacity-80`;

			default:
				return `bg-gray-500 dark:bg-gray-700 bg-opacity-30 dark:bg-opacity-80`
		}
	}

	return (
		<div className={`p-2 rounded-md ${getBgColors()}`}>
			<small>{inventoryItem.currentAmount} </small>
			<small>{inventoryItem.material} in inventory </small>
			<small>and have {inventoryItem.daysRemaining} </small>
		</div>
	)
};