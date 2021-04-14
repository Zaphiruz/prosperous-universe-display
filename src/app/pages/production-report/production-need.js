import React from 'react';
import { startCase } from 'lodash';

const returnConsumption = (orders, inventory) => {
	console.log(orders, inventory);
	let final = orders.map((order) => {
		if (order.completed > 0) {
			return "";
		};
		return order.inputs.map((input) => {
			let ticker = input.material.ticker;
			let timesPerDay = (24 / ((order.duration.millis / (1000 * 60 * 60 * 24)) * 24)).toFixed(3);
			let amountNeeded = input.amount;
			let amountNeededPerDay = amountNeeded * timesPerDay;
			let numberInInventory = inventory.items.find(inv => inv.item.find(element => element.quantity.material.ticker === ticker));
			return [
				ticker,
				amountNeeded,
				timesPerDay,
				amountNeededPerDay,
				numberInInventory
			];
		});
	}).filter(Boolean);



	return final.join(",");
};

export default ({ line }) => {
	return (
		<div className={`p-2 rounded-md bg-gray-400 dark:bg-gray-800`}>
			
		</div>
	)
};