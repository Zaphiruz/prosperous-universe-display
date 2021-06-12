import React from 'react';

export const MarketSelector = React.forwardRef(({ id }, ref) => (
	<div>
		<label htmlFor={"market-selector-"+id}>Market Selector</label>
		<select ref={ref} id={"market-selector-"+id}>
			<option value="NC1" className='dark:bg-gray-900 dark:text-white'>NC1/NCC</option>
			<option value="IC1" className='dark:bg-gray-900 dark:text-white'>IC1/ICA</option>
			<option value="AI1" className='dark:bg-gray-900 dark:text-white'>AI1/AIC</option>
			<option value="CI1" className='dark:bg-gray-900 dark:text-white'>CI1/CIS</option>
			<option value="EC1" className='dark:bg-gray-900 dark:text-white'>EC1/ECD</option>
		</select>
	</div>
))

export const CurrencySelector = React.forwardRef(({ id }, ref) => (
	<div>
		<label htmlFor={"market-selector-"+id}>Market Selector</label>
		<select ref={ref} id={"market-selector-"+id}>
			<option value="NCC" className='dark:bg-gray-900 dark:text-white'>NC1/NCC</option>
			<option value="ICA" className='dark:bg-gray-900 dark:text-white'>IC1/ICA</option>
			<option value="AIC" className='dark:bg-gray-900 dark:text-white'>AI1/AIC</option>
			<option value="CIS" className='dark:bg-gray-900 dark:text-white'>CI1/CIS</option>
			<option value="ECD" className='dark:bg-gray-900 dark:text-white'>EC1/ECD</option>
		</select>
	</div>
))
