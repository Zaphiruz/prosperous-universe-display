import React, { useState, useEffect, useRef } from 'react';
import { query } from 'UTILS/graphql-query-helper';
import config from 'ROOT/config';
import { toUpper } from 'lodash';
import './shipping-calc.less';

import Button from 'COMPONENTS/button';

export default () => {
	let [ currentWeight, setCurrentWeight ] = useState(0);
	let [ currentVolume, setCurrentVolume ] = useState(0);
	let newMaterial = useRef('');
	let newCount = useRef('');

	let [ error, setError ] = useState('');
	let [ itemList, setItemList ] = useState([]);
	const maxVolume = 500;
	const maxWeight = 500;

	useEffect(() => {
		computeCurrentValues(itemList)
	}, [itemList])

	useEffect(() => {
		newMaterial.current.focus();
	 }, []);

	const addItem = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		clearErrors();

		let addCount = parseInt(newCount.current.value);
		let addMaterial = newMaterial.current.value;

		let previousItem = itemList.find(item => item.ticker === addMaterial) 
		if (previousItem) {
			let count = previousItem.amount + addCount;

			previousItem.amount = count
			previousItem.weight = previousItem.material.weight * count;
			previousItem.volume = previousItem.material.volume * count;
		} else {
			let material = await query(config.api, 'materialOne', { ticker: toUpper(addMaterial) }, { weight: true, volume: true });
			if(!material) {
				return setError('No material Found')
			}

			let weight = material.weight * addCount;
			let volume = material.volume * addCount;

			itemList.push({ ticker: toUpper(addMaterial), amount: addCount, weight, volume, material })
		}

		setItemList([...itemList]);
		clearInputs();
		newMaterial.current.focus();
	}

	const removeItem = (i, e) => {
		e.preventDefault();
		e.stopPropagation();
		clearErrors();

		itemList.splice(i, 1);

		setItemList([...itemList]);
	}

	const computeCurrentValues = (itemLists) => {
		let { currentWeight, currentVolume } = itemLists.reduce((acc, {weight, volume}) => {
			acc.currentWeight += parseFloat(weight);
			acc.currentVolume += parseFloat(volume);
			return acc;
		}, {currentWeight: 0, currentVolume: 0});

		setCurrentWeight(currentWeight);
		setCurrentVolume(currentVolume);
	}

	const resetList = (e) => {
		e.preventDefault();
		e.stopPropagation();

		clearErrors();
		clearInputs();

		setItemList([]);
	}

	const clearErrors = () => {
		setError('');
	}

	const clearInputs = () => {
		newMaterial.current.value = '';
		newCount.current.value = '';
	}

	const renderErrorString = error
		? <div className='text-red-500 dark:text-red-700'>Error: {error}</div>
		: null;

	return (
		<div className='shipping-calc container mx-auto p-3'>
			<h1 className='text-xl capitalize inline-block'>Shipping Calculator</h1>

			<div className='lg:flex'>
				<div className='w-4/5 lg:mr-4'>
					<form onSubmit={addItem}>
						<table>
							<thead>
								<tr>
									<th>Ticker</th>
									<th>Amount</th>
									<th>Weight (t)</th>
									<th>Volume (m<sup>3</sup>)</th>
									<th>&nbsp;</th>
								</tr>
							</thead>

							<tbody>
								{itemList.map((listItem, i) => (
									<tr key={listItem.ticker}>
										<td>{listItem.ticker}</td>
										<td>{listItem.amount}</td>
										<td>{listItem.weight.toFixed(2)}</td>
										<td>{listItem.volume.toFixed(2)}</td>
										<td>
											<Button type='button'
												className='bg-red-500 dark:bg-red-700 flex justify-center items-center'
												size='sm'
												onClick={(e) => removeItem(i, e)}
											>
												<span className="material-icons text-sm">clear</span>
											</Button>
										</td>
									</tr>
								))}
							</tbody>

							<tfoot className='divide-y divide-blue-700 divide-opacity-30'>
								<tr>
									<td>
										<input type='text'
											tabIndex="1"
											id='ticker'
											name='ticker'
											className='mr-2'
											required="required"
											pattern='[a-zA-Z0-9]{1,3}'
											ref={newMaterial}
											placeholder='i.e. RAT'
											title="Ticker should only contain 1-3 charactors. i.e. RAT, DW, H"
										/>
									</td>
									<td>
										<input type='text'
											tabIndex="2"
											id='count'
											name='count'
											className='mr-2'
											required="required"
											pattern='\d+'
											ref={newCount}
											placeholder='i.e. 100'
											title="Count should only be positive numbers i.e. 1, 12, 123, 1234"
										/>
									</td>
									<td>&nbsp;</td>
									<td>&nbsp;</td>
									<td>
										<Button type='submit' tabIndex="3" className='flex justify-center items-center whitespace-nowrap bg-blue-700 bg-opacity-30 focus:text-bold focus:bg-opacity-100'>
											<span className="material-icons">add</span> Add Line
										</Button>
									</td>
								</tr>

								<tr>
									<td>&nbsp;</td>
									<td>&nbsp;</td>
									<td>&nbsp;</td>
									<td>&nbsp;</td>
									<td>
										<Button type='button'
											className='bg-red-500 dark:bg-red-700'
											onClick={resetList}
										>
											Reset
										</Button>
									</td>
								</tr>
							</tfoot>
						</table>
					</form>

					{renderErrorString}
				</div>
				
				<dl>
					<table>
						<thead>
							<tr>
								<th>&nbsp;</th>
								<th>Weight</th>
								<th>Volume</th>
							</tr>
						</thead>

						<tbody>
							<tr>
								<td>Current</td>
								<td>{currentWeight.toFixed(2)}</td>
								<td>{currentVolume.toFixed(2)}</td>
							</tr>
							<tr>
								<td>Max</td>
								<td>{maxWeight.toFixed(2)}</td>
								<td>{maxVolume.toFixed(2)}</td>
							</tr>
						</tbody>

						<tfoot>
							<tr>
								<td>Total</td>
								<td className={maxWeight - currentWeight < 0 ? 'text-red-500 dark:text-red-700' : ''}>{(maxWeight - currentWeight).toFixed(2)}</td>
								<td className={maxVolume - currentVolume < 0 ? 'text-red-500 dark:text-red-700' : ''}>{(maxVolume - currentVolume).toFixed(2)}</td>
							</tr>
						</tfoot>
					</table>
				</dl>
			</div>
		</div>
	);
}