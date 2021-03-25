import React from 'react';
import { startCase } from 'lodash'

export default ({ material }) => (
	<div className='bg-gray-400 dark:bg-gray-800 p-2 rounded-md'>
		<small className='text-gray-500 dark:text-gray-400 mr-2'>{material.ticker}</small>
		<h3 className='text-lg capitalize inline-block'>{startCase(material.name)}</h3>
		<div className='grid grid-flow-row grid-cols-2 gap-2 mt-1'>
			<dl>
				<dt className='font-bold capitalize'>weight:</dt>
				<dl>{material.weight} t</dl>
			</dl>

			<dl>
				<dt className='font-bold capitalize'>volume:</dt>
				<dl>{material.volume} m<sup>3</sup></dl>
			</dl>
		</div>

		<dl>
			<dt className='font-bold capitalize'>category:</dt>
			<dl>{material.category?.name}</dl>
		</dl>
	</div>
);
