import React from 'react';
import { startCase } from 'lodash';

export default ({ inventoryItem }) => {
	return (
		<div className={`p-2 rounded-md bg-gray-400 dark:bg-gray-800`}>
			<small>{inventoryItem.currentAmount} </small>
			<small>{inventoryItem.material} in inventory </small>
			<small>and have {inventoryItem.daysRemaining} </small>
		</div>
	)
};