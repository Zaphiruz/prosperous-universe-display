import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { query, paginate } from 'UTILS/graphql-query-helper';
import { toUpper, startCase, uniq, flatMap, localeCompare } from 'lodash';
import config from 'ROOT/config';
import './planets.less';

import PlanetVisual from './planet';
import Loading from 'COMPONENTS/loading';

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

export default () => {
	console.log("Loading page...");

	//let [planets, setPlanets] = useState([]);
	//let [company, setCompany] = useState({});
	//let [filterMaterial, setFilterMaterial] = useState('');
	let [planetResults, setPlanetResults] = useState([]);
	//let [filterPlanetTier, setFilterPlanetTier] = useState('');
	//let [filterFertility, setFertility] = useState(-1);
	let [distanceTarget, setDistanceTarget] = useState('Moria');
	let [paginationPage, setPaginationPage] = useState(1);
	let [paginationMax, setPaginationMax] = useState(-1);
	let materialFilterRef = useRef('');
	let tierFilterRef = useRef('');
	//let fertilityFilterRef = useRef('');
	//let distanceFilterRef = useRef('');
	let targetFilterRef = useRef('');

	//const fetchPlanets = async () => {
	//	console.log("About to query");

	//	let planets = await paginate(config.api, 'planetPagination', { perPage: 100, filter: {} }, PlanetQuery);
	//	console.log("planets", planets);
	//	planets = planets.items.filter((planet) => !!planet.data.resources.length);
	//	setPlanets(planets);
	//	return planets;
	//}

	useEffect(async () => {
		//let planets = await fetchPlanets();
		//setPlanetResults(planets);
		paginateQuery(1, 50);
	}, []);

	//const resourcesUnique = _.uniq(_.flatMap(planets.map((planet) => planet.data.resources.map((resource) => resource.material.ticker)))).sort(function (a, b) { return a.localeCompare(b) });

	const paginateQuery = async (page, perPage) => {
		setPlanetResults([]);
		setPaginationMax(-1);
		let newMaterialFilter = toUpper(materialFilterRef.current.value);
		let tierQuery = (tierFilterRef.current.value === "Any") ? undefined : { planetTier: parseInt(tierFilterRef.current.value) };
		let mat = null;
		if (newMaterialFilter) {
			mat = await query(config.api, 'materialOne', { filter: { ticker: newMaterialFilter } }, MaterialQuery);
        }
		let filter = {};
		if (mat?.id) {
			filter.materials = [mat.id];
		}
		if (tierQuery) {
			filter.tier = tierQuery;
		}
		let filteredPlanets = await paginate(config.api, 'planetPagination', { perPage: perPage, page: page, filter: filter }, PlanetQuery);
		setPaginationPage(filteredPlanets.pageInfo.currentPage);
		setPaginationMax(filteredPlanets.pageInfo.pageCount);
		filteredPlanets = filteredPlanets.items.filter((planet) => !!planet.data.resources.length);
		setPlanetResults(filteredPlanets);
		console.log("FilteredPlanets", filteredPlanets);
    }

	const onSubmitClick = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		setPaginationPage(1);
		paginateQuery(1, 20);
	};

	const switchPage = async (e) => {
		let pageCount = 50;
		if ((e === -1 && paginationPage === 1) || paginationMax === -1) {
			return;
		}
		else if (e === -10) {
			setPaginationPage(1);
			paginateQuery(1, pageCount);
		}
		else if (e === 10) {
			setPaginationPage(paginationMax);
			paginateQuery(paginationMax, pageCount);
        }
		else {
			setPaginationPage(paginationPage + e);
			paginateQuery(paginationPage + e, pageCount);
        }
    }

	// Show what would take to build on the planet


	//<strong> Max Distance </strong>
	//<input type='number'
	//	id='fertilityFilter'
	//	step="1"
	//	name='distanceFilter'
	//	className='mr-2 text-white'
	//	placeholder='Whole number: 1, 2, 3'
	//	ref={distanceFilterRef}
	//	title="Distance needs to be a whole number."
	///>

	//<strong> Fertility </strong>
	//<input type='number'
	//	id='fertilityFilter'
	//	step="any"
	//	name='fertilityFilter'
	//	className='mr-2 text-white'
	//	placeholder='0-1, leave blank if all'
	//	ref={fertilityFilterRef}
	//	title="Fertility should be a number between 0 and 1. -1 is for all."
	///>

	return (
		<div className='consuption-report container mx-auto p-3'>
			<div>
				<form onSubmit={onSubmitClick}>
					<label>
						<strong> Filter:</strong>
						<input type='text'
							id='materialFilter'
							name='materialFilter'
							ref={materialFilterRef}
							className="mr-2 text-white"
							pattern='[a-zA-Z0-9]{1,3}'
							placeholder='i.e. RAT'
							title="Ticker should only contain 1-3 charactors. i.e. RAT, DW, H"
						/>

						<strong> Planet Tier: </strong>
						<select className="text-white" id='tierFilter' ref={tierFilterRef}>
							<option key="Any" value="Any" className="text-black">Any</option>
							<option key="3" value="3" className="text-black">3</option>
							<option key="2" value="2" className="text-black">2</option>
							<option key="1" value="1" className="text-black">1</option>
							<option key="0" value="0" className="text-black">0</option>
						</select>

						<strong> Target </strong>
						<select className="text-white" id='targetFilter' ref={targetFilterRef}>
							<option key="Moria" value="Moria" className="text-black">Moria</option>
							<option key="Hortus" value="Hortus" className="text-black">Hortus</option>
							<option key="Benten" value="Benten" className="text-black">Benten</option>
							<option key="Antares" value="Antares" className="text-black">Antares</option>
						</select>

					</label>

					<button type='submit'>
						<span className="material-icons">add_circle_outline</span>
					</button>
				</form>

			</div>
			{planetResults.length && (
				<div className=''>
					{planetResults.map(planet => (
						<PlanetVisual planet={planet} target={targetFilterRef.current.value} key={planet.naturalId} />
					))}
				</div>
			) || (
				<Loading />
			)}

			<div className="flex justify-center">
				<button className='flex justify-center items-center whitespace-nowrap bg-blue-700 bg-opacity-30 focus:text-bold focus:bg-opacity-100 mr-2 p-1' onClick={() => switchPage(-10)}>First</button>
				<button className='flex justify-center items-center whitespace-nowrap bg-blue-700 bg-opacity-30 focus:text-bold focus:bg-opacity-100 mr-2 p-1' onClick={() => switchPage(-1)}>Prior</button>
				<div className='mr-2 p-1'>
					<h3>Page {paginationPage}</h3>
				</div>
				<button className='flex justify-center items-center whitespace-nowrap bg-blue-700 bg-opacity-30 focus:text-bold focus:bg-opacity-100 mr-2 p-1' onClick={() => switchPage(1)}>Next</button>
				<button className='flex justify-center items-center whitespace-nowrap bg-blue-700 bg-opacity-30 focus:text-bold focus:bg-opacity-100 mr-2 p-1' onClick={() => switchPage(10)}>Last</button>
			</div>

		</div>
	);

}