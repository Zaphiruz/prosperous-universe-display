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

export const CurrecyToMarket = {
	NCC: 'NC1', NC1: 'NC1',
	ICA: 'IC1', IC1: 'IC1',
	AIC: 'AI1', AI1: 'AI1',
	CIS: 'CI1', CI1: 'CI1',
	ECD: 'EC1', EC1: 'EC1'
}

export const MarketToCurrency = {
	NCC: 'NCC', NC1: 'NCC',
	ICA: 'ICA', IC1: 'ICA',
	AIC: 'AIC', AI1: 'AIC',
	CIS: 'CIS', CI1: 'CIS',
	ECD: 'ECD', EC1: 'ECD'
}
