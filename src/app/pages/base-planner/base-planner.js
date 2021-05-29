import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { query, paginate } from 'UTILS/graphql-query-helper';
import { toUpper, startCase, uniq, flatMap, localeCompare } from 'lodash';
import config from 'ROOT/config';
import './base-planner.less';

import Loading from 'COMPONENTS/loading';
import Button from 'COMPONENTS/button';

const PlanetQuery = {
	_id: true,
	address: {				// Errors out
		lines: {
			type: true,
			entity: {
				id: true,
				name: true,
				naturalId: true,
				_type: true
			}
		}
	},
	//celestialBodies: [],		// Errors out
	//cogcId: true,
	//country: true,
	//currency: true,
	data: {					// Errors out
		fertility: true,
		gravity: true,
		//magneticField: true,
		//mass: true,
		//massEarth: true,
		//orbitIndex: true,
		plots: true,
		pressure: true,
		//radiation: true,
		//radius: true,
		resources: {
			factor: true,
			type: true,
			material: {
				id: true,
				ticker: true,
				name: true
			}
		},
		//sunlight: true,
		surface: true,
		temperature: true,
		takenPlots: true
	},
	governor: true,
	id: true,
	name: true,
	//nameable: true,
	//namer: true,
	//namingDate: true,
	naturalId: true,
	planetId: true,
	populationId: true,
	tier: {
		gravity: true,
		pressure: true,
		temperature: true,
		planetTier: true
	},
	systemId: {
		name: true,
		sectorId: true,
		systemId: true,
		distances: {
			toMoria: true,
			toBenten: true,
			toHortus: true,
			toAntares: true,
		}
	}
};

const MaterialQuery = {
	id: true,
	ticker: true,
	name: true
};

const CompanyQuery = {
	id: true,
	name: true,
	code: true,
	ownCurrency: {
		code: true
	},
	ratingReport: {
		overallRating: true,
		subRatings: {
			rating: true,
			score: true
		}
	}
};

const BuildingOptionQuery = {
	name: true,
	ticker: true,
	type: true,
	area: true,
	expertiseCategory: true,
	needsFertileSoil: true,
	workforceCapacities: {
		level: true,
		capacity: true,
	},
	materials: {
		quantities: {
			amount: true,
			material: {
				ticker: true,
            }
		},
	},
};

const SiteQuery = {
	siteId: true,
	owner: {
		name: true,
		code: true,
		id: true,
	},
	//platforms: {
	//	name: true,
	//	area: true,
	//	condition: true,
	//	creationTime: {
	//		timestamp: true
	//	},
	//	lastRepair: {
	//		timestamp: true
	//	},
	//},
	address: {
		type: true,
		entity: {
			name: true,
		}
	},
}

const InventoryQuerys = {
	type: true,
	items: {
		id: true,
		quantity: {
			amount: true,
			material: {
				id: true,
				ticker: true,
				name: true,
			}
		}
	},
	addressableId: {
		siteId: true
	}
}

const ProductionQuery = {
	id: true,
	owner: true,
	siteId: true,
	type: true,
	capacity: true,
	slots: true,
	efficiency: true,
	condition: true,
	workforces: {
		level: true,
		efficiency: true,
	},
	orders: {
		completed: true,
		completion: true,
		created: {
			timestamp: true
		},
		duration: {
			millis: true
		},
		halted: true,
		inputs: {
			amount: true,
			value: {
				amount: true,
				currency: true,
			},
			material: {
				_id: true,
				name: true,
				ticker: true,
				volume: true,
				weight: true,
				category: {
					name: true
				}
			}
		},
		outputs: {
			amount: true,
			value: {
				amount: true,
				currency: true,
			},
			material: {
				id: true,
				name: true,
				ticker: true,
				volume: true,
				weight: true,
				category: {
					name: true
				}
			}
		},
		productionFee: {
			amount: true,
			currency: true
		},
		productionLineId: true,
		recurring: true,
		started: true,
	},
	productionTemplates: {
		duration: {
			millis: true
		},
		efficiency: true,
		effortFactor: true,
		id: true,
		inputFactors: {
			factor: true,
			material: {
				id: true,
				name: true,
				ticker: true,
				volume: true,
				weight: true,
				category: {
					name: true
				}
			}
		},
		outputFactors: {
			factor: true,
			material: {
				id: true,
				name: true,
				ticker: true,
				volume: true,
				weight: true,
				category: {
					name: true
				}
			}
		},
		productionFeeFactor: {
			amount: true,
			currency: true
		}
	},
	efficiencyFactors: {
		effectivity: true,
		expertiseCategory: true,
		type: true,
		value: true
	}
};

export default () => {
	console.log("Loading page...");

	let [error, setError] = useState('');
	let [itemList, setItemList] = useState([]);

	let [buildingOptions, setBuildingOptions] = useState([]);
	let [tableData, setTableData] = useState([]);

	const tableHeaders = [
		{
			header: null,
			materialColumn: false,
			columns: [
				'Building',
			]
		},
		{
			header: null,
			materialColumn: false,
			columns: [
				'Number',
			]
		},
		{
			header: 'Base',
			materialColumn: false,
			columns: [
				'Area',
			]
		},
		{
			header: 'BFabs',
			materialColumn: true,
			columns: [
				'BBH',
				'BDE',
				'BSE',
				'BTA'
			]
		},
		{
			header: 'LFabs',
			materialColumn: true,
			columns: [
				'LBH',
				'LDE',
				'LSE',
				'LTA'
			]
		},
		{
			header: 'RFabs',
			materialColumn: true,
			columns: [
				'RBH',
				'RDE',
				'RSE',
				'RTA'
			]
		},
		{
			header: 'AFabs',
			materialColumn: true,
			columns: [
				'ABH',
				'ADE',
				'ASE',
				'ATA'
			]
		},
		{
			header: 'Other',
			materialColumn: true,
			columns: [
				'TRU',
			]
		},
		{
			header: 'Planet',
			materialColumn: true,
			columns: [
				'MCG',
				'Gravity',
				'Temp',
				'Pressure'
			]
		},
		{
			header: null,
			columns: [
				'',
			]
		},
	]

	const fetchBuildingOptions = async () => {
		let buildingOptions = await query(config.api, 'buildingOptionMany', { filter: {} }, BuildingOptionQuery);
		setBuildingOptions(buildingOptions);
	};

	useEffect(async () => {
		fetchBuildingOptions();

	}, []);

	const addItem = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		clearErrors();

		let ticker = e.target.elements.ticker.value.toUpperCase();
		let num = parseInt(e.target.elements.count.value);
		let option = buildingOptions.find(option => option.ticker === ticker);

		if (option) {
			tableData.push({ ticker: ticker, num: num, option: option });
			console.log("tableData", tableData);
			setTableData([...tableData]);

			e.target.elements.ticker.value = '';
			e.target.elements.count.value = '';
        }

	};

	const removeItem = async (i, e) => {
		console.log("Would have removed something");
	};

	const resetList = async (i, e) => {
		console.log("Would have reset");
	};

	const onBuildingOptionChange = (e) => {
		console.log("Something changed 1", e.target.value.toUpperCase());
		if (e.target.value && e.target.value.length > 1) {

			let option = buildingOptions.filter(option => option.ticker === e.target.value.toUpperCase());

			if (option.length) {
				console.log("Something changed", e.target.value.toUpperCase(), option);

            }
        }
		
	};

	const updateRowCount = (item) => (e) => {
		console.log("Would have updated a row's amount", e.target.value);
		item.num = e.target.value;
		setTableData([...tableData]);
	};

	const clearErrors = () => {
		setError('');
	}

	return (
		<div className='base-planning container mx-auto p-3'>
			<h1 className='text-xl capitalize inline-block'>Base Planner</h1>

			<div className='lg:flex'>
				<div className='w-4/5 lg:mr-4'>
					<form onSubmit={addItem}>
						<table>
							<thead>
								<tr>

									{
										tableHeaders.map((item, i) => {
											if (item.header) {
												return <th colSpan={item.columns.length} key={"colHeader" + i}>{item.header}</th>
											} else {
												return <td rowSpan='1' key={"colHeader" + i}></td>;	
                                            }
                                        })
                                    }
								</tr>
								<tr>

									{
										tableHeaders.flatMap((item, i) => {
											return item.columns.map((subHeader) => {
												return <th key={"colSubHeader" + subHeader}>{subHeader}</th>
                                            })
                                        })
                                    }
								</tr>
							</thead>

							<tbody>
								{tableData.map((item, i) => (
									<tr key={"rowData" + item.ticker + i}>
										<td>{item.ticker}</td>
										<td>
											<input type='text'
												id={"rowDataAmount" + item.ticker + i}
												name={"rowDataAmount" + item.ticker + i}
												className='mr-2'
												required="required"
												pattern='\d+'
												placeholder='i.e. 2'
												title="Count should only be positive numbers i.e. 1, 12, 123, 1234"
												value={item.num}
												onChange = {updateRowCount(item)}
											/>
										</td>
										<td>{item.option.area * item.num}</td>
										
										{tableHeaders.flatMap((tableHeader) => {
											if (tableHeader.materialColumn) {
												return tableHeader.columns.map((columnName) => {
													let amount = 0;
													let materialQuantity = item.option.materials.quantities.find((materialQuantity) => materialQuantity.material.ticker === columnName)
													if (materialQuantity) {
														amount = materialQuantity.amount * item.num;
													}
													return <td key={'rowValue' + columnName + item.ticker + i}>{amount}</td>;
												})
											}
											return [];
										})}

										{tableHeaders.find((headerData) => headerData.header === 'LFabs')?.columns.map((columnName) => {
											let amount = 0;
											let materialQuantity = item.option.materials.quantities.find((materialQuantity) => materialQuantity.material.ticker === columnName)
											if (materialQuantity) {
												amount = materialQuantity.amount * item.num;
											}
											return <td key={'rowValue' + columnName + item.ticker + i}>{amount}</td>;
										})}

										{tableHeaders.find((headerData) => headerData.header === 'RFabs')?.columns.map((columnName) => {
											let amount = 0;
											let materialQuantity = item.option.materials.quantities.find((materialQuantity) => materialQuantity.material.ticker === columnName)
											if (materialQuantity) {
												amount = materialQuantity.amount * item.num;
											}
											return <td key={'rowValue' + columnName + item.ticker + i}>{amount}</td>;
										})}

										{tableHeaders.find((headerData) => headerData.header === 'AFabs')?.columns.map((columnName) => {
											let amount = 0;
											let materialQuantity = item.option.materials.quantities.find((materialQuantity) => materialQuantity.material.ticker === columnName)
											if (materialQuantity) {
												amount = materialQuantity.amount * item.num;
											}
											return <td key={'rowValue' + columnName + item.ticker + i}>{amount}</td>;
										})}

										{tableHeaders.find((headerData) => headerData.header === 'Other')?.columns.map((columnName) => {
											let amount = 0;
											let materialQuantity = item.option.materials.quantities.find((materialQuantity) => materialQuantity.material.ticker === columnName)
											if (materialQuantity) {
												amount = materialQuantity.amount * item.num;
											}
											return <td key={'rowValue' + columnName + item.ticker + i}>{amount}</td>;
										})}

										{tableHeaders.find((headerData) => headerData.header === 'Planet')?.columns.map((columnName) => {
											let amount = 0;
											let materialQuantity = item.option.materials.quantities.find((materialQuantity) => materialQuantity.material.ticker === columnName)
											if (materialQuantity) {
												amount = materialQuantity.amount * item.num;
											}
											return <td key={'rowValue' + columnName + item.ticker + i}>{amount}</td>;
										})}

									</tr>
								))}
							</tbody>

							<tfoot className='divide-y divide-blue-700 divide-opacity-30'>
								<tr>
									<td>
										<input type='text'
											placeholder="i.e. HB1"
											id='ticker'
											list="opts"
											required="required"
											title="Needs a building code, such as HB1 or PP1" />
										<datalist id="opts">
											{
												buildingOptions.length && (
													buildingOptions.map((item) => <option key={item.ticker} value={item.ticker}>{item.ticker}</option>) 
												) || (
													<option> TBD </option>
												)
                                            }
										</datalist>
									</td>
									<td>
										<input type='text'
											id='count'
											name='count'
											className='mr-2'
											required="required"
											pattern='\d+'
											placeholder='i.e. 2'
											title="Count should only be positive numbers i.e. 1, 12, 123, 1234"
										/>
									</td>
									<td>
										<Button type='submit' className='flex justify-center items-center whitespace-nowrap bg-blue-700 bg-opacity-30 focus:text-bold focus:bg-opacity-100'>
											<span className="material-icons">add</span> Add
										</Button>
									</td>
								</tr>

								<tr>
									<td></td>
									<td>Totals</td>
									{
										tableHeaders.flatMap((item) => {
											if (item.header) {
												if (tableData.length) {
													return item.columns.map((column) => {
														return <td key={"totalRow" + column}>{tableData.reduce((a, b) => ({ x: a[column] + b[column] }, 0))}</td>
													});
												}
											}
											return [];
										})
									}
								</tr>

								<tr>
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
					<h3>Add totals</h3>
					<h3>Add planet selection</h3>
					<h3>Add save/load</h3>
					<h3>Add costs - Corp pricing? CX?</h3>
					<h3>Add section sharing what the planet produces each day (fertility, mats, etc)</h3>
					<h3>Add section on how far a planet is from CXs</h3>
					<h3>Add section on how many workers you'll need for each type</h3>
					<h3>Add area usage</h3>
					<h3>Shift to Select from datalist</h3>
				</div>

				
			</div>
		</div>
	);

}