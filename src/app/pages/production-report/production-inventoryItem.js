import React from 'react';
import { startCase } from 'lodash';

export default ({ inventoryItem }) => {

	const getBgColors = () => {
		if (inventoryItem.direction === -1) {
			if (inventoryItem.changeAmount <= 1) {
				return `bg-red-700 dark:bg-red-900 bg-opacity-30 dark:bg-opacity-80`;
			} else if (inventoryItem.changeAmount <= 5) {
				return `bg-yellow-400 dark:bg-yellow-700 bg-opacity-30 dark:bg-opacity-80`;
			} else {
				return `bg-gray-500 dark:bg-gray-700 bg-opacity-30 dark:bg-opacity-80`;
            }
		} else if (inventoryItem.direction === 1) {
			return `bg-gray-500 dark:bg-gray-700 bg-opacity-30 dark:bg-opacity-80`;
        } else {
			return `bg-gray-500 dark:bg-gray-700 bg-opacity-30 dark:bg-opacity-80`;
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