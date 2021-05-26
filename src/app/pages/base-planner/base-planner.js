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

	useEffect(async () => {
		//let planets = await fetchPlanets();
		//setPlanetResults(planets);
	}, []);

	const addItem = async (e) => {
		console.log("Would have done something");
	}

	const removeItem = async (i, e) => {
		console.log("Would have removed something");
    }

	const resetList = async (i, e) => {
		console.log("Would have reset");
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
									<td rowSpan="1"></td>
									<td rowSpan="1"></td>
									<td rowSpan="1"></td>
									<th colSpan="4">BFabs</th>
									<th colSpan="4">LFabs</th>
									<th colSpan="4">RFabs</th>
									<th colSpan="4">AFabs</th>
									<th colSpan="4">Planet</th>
								</tr>
								<tr>
									<th>Building</th>
									<th>Number</th>
									<th>Area</th>
									<th>BBH</th>
									<th>BDE</th>
									<th>BSE</th>
									<th>BTA</th>
									<th>LBH</th>
									<th>LDE</th>
									<th>LSE</th>
									<th>LTA</th>
									<th>RBH</th>
									<th>RDE</th>
									<th>RSE</th>
									<th>RTA</th>
									<th>ABH</th>
									<th>ADE</th>
									<th>ASE</th>
									<th>ATA</th>
									<th>Ground</th>
									<th>Gravity</th>
									<th>Temp</th>
									<th>Pressure</th>
									<th>&nbsp;</th>
								</tr>
							</thead>

							<tbody>
								{itemList.map((listItem, i) => (
									<tr key={listItem.ticker}>
										<td>building</td>
										<td>num</td>
										<td>area</td>
										<td>bfab</td>
										<td>bfab</td>
										<td>bfab</td>
										<td>bfab</td>
										<td>lfab</td>
										<td>lfab</td>
										<td>lfab</td>
										<td>lfab</td>
										<td>rfab</td>
										<td>rfab</td>
										<td>rfab</td>
										<td>rfab</td>
										<td>afab</td>
										<td>afab</td>
										<td>afab</td>
										<td>afab</td>
										<td>planet</td>
										<td>planet</td>
										<td>planet</td>
										<td>planet</td>
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
											id='building'
											name='building'
											className='mr-2'
											required="required"
											pattern='[a-zA-Z0-9]{1,3}'
											placeholder='i.e. HB1'
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
											placeholder='i.e. 2'
											title="Count should only be positive numbers i.e. 1, 12, 123, 1234"
										/>
									</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
									<td>0</td>
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
				</div>

				
			</div>
		</div>
	);

}