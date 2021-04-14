import React from 'react';
import { startCase, uniqWith} from 'lodash';

const returnItem = (orders) => {
	let output = {}

	orders.map((order) => {
		order.map((item) => {
			//console.log(item.amount);
			if (item.ticker in output)
				output[item.ticker] += parseFloat(item.amount);
			else {
				output[item.ticker] = parseFloat(item.amount);
            }
		});
	});

	if (Object.keys(output).length < 1) {
		return "None";
    }

	let final = []
    for (let [key, value] of Object.entries(output)) {
		final.push(`${key}: ${value}`);
    }	
	final = final.join(" | ");

	return final;
};

export default ({ line }) => {
	return (
		<div className={`p-2 rounded-md bg-gray-400 dark:bg-gray-800`}>
			<h3 className='text-lg capitalize inline-block'>Making {returnItem(line.outputs)}</h3> {"\n"}
			<h3 className='text-lg capitalize inline-block'>Burning {returnItem(line.inputs)}</h3>
		</div>
	)
};