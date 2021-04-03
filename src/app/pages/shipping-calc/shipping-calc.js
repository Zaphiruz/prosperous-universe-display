import React, { useState, useEffect } from 'react';
import { query } from 'UTILS/graphql-query-helper';
import config from 'ROOT/config';
import './shipping-calc.less';

export default () => {
	let [ currentWeight, setCurrentWeight ] = useState(0);
	let [ currentVolume, setCurrentVolume ] = useState(0);
	let [ newMaterial, setNewMaterial ] = useState('');
	let [ newCount, setNewCount ] = useState('');
	let [ error, setError ] = useState('');
	let [ itemList, setItemList ] = useState([]);
	const maxVolume = 500;
	const maxWeight = 500;

	useEffect(() => {
		console.log(itemList.length)
		computeCurrentValues(itemList)
	}, [itemList])

	const addItem = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		clearErrors();

		let parsedNewCount = parseInt(newCount);

		let previousItem = itemList.find(item => item.ticker === newMaterial) 
		if (previousItem) {
			let count = previousItem.amount + parsedNewCount;

			previousItem.amount = count
			previousItem.weight = previousItem.material.weight * count;
			previousItem.volume = previousItem.material.volume * count;
		} else {
			let material = await query(config.api, 'materialOne', { ticker: newMaterial }, { weight: true, volume: true });
			if(!material) {
				return setError('No material Found')
			}

			let weight = material.weight * parsedNewCount;
			let volume = material.volume * parsedNewCount;

			itemList.push({ ticker: newMaterial, amount: parsedNewCount, weight, volume, material })
		}

		setItemList([...itemList]);
		clearInputs();
	}

	const computeCurrentValues = (itemLists) => {
		let { currentWeight, currentVolume } = itemLists.reduce((acc, {weight, volume}) => {
			acc.currentWeight += parseFloat(weight);
			acc.currentVolume += parseFloat(volume);

			console.log(acc);
			return acc;
		}, {currentWeight: 0, currentVolume: 0});

		console.log(currentWeight, currentVolume);

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
		setNewMaterial('');
		setNewCount('');
	}

	const renderErrorString = error
		? <div className='text-red-500 dark:text-red-700'>Error: {error}</div>
		: null;

	return (
		<div className='shipping-calc container mx-auto p-3'>
			<h1 className='text-xl capitalize inline-block'>Shipping Calculator</h1>

			<div className='flex'>
				<div className='w-4/5'>
					<h3>List</h3>
					<ul>
						{itemList.map((listItem, i) => (
							<li key={i}>
								{listItem.amount}x {listItem.ticker} - {listItem.volume.toFixed(2)}m<sup>3</sup> {listItem.weight.toFixed(2)}t
							</li>
						))}
					</ul>
					<button type='button'
						onClick={resetList}
					>
						Reset
					</button>

					{renderErrorString}
					
					<form onSubmit={addItem}>
						<label>
							Ticker
							<input type='text'
								id='ticker'
								name='ticker'
								className='mr-2 text-black'
								required="required"
								pattern='[a-zA-Z0-9]{3}'
								value={newMaterial}
								onChange={(e) => {setNewMaterial(e.target.value)}}
							/>
						</label>

						<label>
							Count
							<input type='text'
								id='count'
								name='count'
								className='mr-2 text-black'
								required="required"
								pattern='\d+'
								value={newCount}
								onChange={(e) => {setNewCount(e.target.value)}}
							/>
						</label>

						<button type='submit'>
							<span className="material-icons">add_circle_outline</span>
						</button>
					</form>

					
				</div>
				
				<dl className='flex'>
					<div>
						<dt><h3>Weight</h3></dt>
						<dd>
							<ul className='list-none'>
								<li>Current: {currentWeight.toFixed(2)}</li>
								<li>Max: {maxWeight.toFixed(2)}</li>
								<li className={maxWeight - currentWeight < 0 ? 'text-red-500 dark:text-red-700' : ''}>Total: {(maxWeight - currentWeight).toFixed(2)}</li>
							</ul>
						</dd>
					</div>

					<div className='ml-4'>
						<dt><h3>Volume</h3></dt>
						<dd>
							<ul className='list-none'>
								<li>Current: {currentVolume.toFixed(2)}</li>
								<li>Max: {maxVolume.toFixed(2)}</li>
								<li className={maxVolume - currentVolume < 0 ? 'text-red-500 dark:text-red-700' : ''}>Total: {(maxVolume - currentVolume).toFixed(2)}</li>
							</ul>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}