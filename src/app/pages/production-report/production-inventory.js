import React from 'react';
import { startCase } from 'lodash';

import ProductionInventoryItem from './production-inventoryItem';

const testing = (item) => {
	console.log("Test 1", item);
	return item;
}

export default ({ inventoryOutput }) => {
	return (
		<div className={`p-2 rounded-md bg-gray-400 dark:bg-gray-800`}>
			{inventoryOutput.map((item) => (
				<ProductionInventoryItem inventoryItem={testing(item)} key={"productionInventoryItem" + item.material} />
			))}
		</div>
	)
};