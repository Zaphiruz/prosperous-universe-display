import React from 'react';
import { capitalize } from 'lodash';

const returnOrders = (orders) => {
	let final = orders.map((order) => {
		if (order.completed > 0) {
			return "";
		};
		return order.outputs.map((output) => {
			return output.material.ticker;
		});
	})
		.filter(Boolean)
		.join(',');

	return final;
};

const returnConsumption = (orders) => {
	let final = orders.map((order) => {
		if (order.completed > 0) {
			return "";
		};
		return order.inputs.map((input) => {
			return input.material.ticker;
		});
	})
		.filter(Boolean)
		.join(',');

return final;
};

export default ({ orders }) => {

	return (
		<div className={`p-2 rounded-md bg-gray-400 dark:bg-gray-800`}>
			<h3 className='text-lg capitalize inline-block'>Making {returnOrders(orders)}</h3> {"\n"}
			<h3 className='text-lg capitalize inline-block'>Burning {returnConsumption(orders)}</h3>
		</div>
	)
};