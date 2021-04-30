import React from 'react';
import { startCase } from 'lodash';

import ProductionInventoryItem from './production-inventoryItem';

export default ({ inventoryOutput }) => {
	return (
		<div className={`grid grid-flow-row grid-cols-2 gap-2 mt-1 `}>
			{inventoryOutput.map((item) => (
				<ProductionInventoryItem inventoryItem={item} key={"productionInventoryItem" + item.material} />
			))}
		</div>
	);
};