import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { query, paginate } from 'UTILS/graphql-query-helper';
import { toUpper, startCase, uniq, flatMap, localeCompare } from 'lodash';
import config from 'ROOT/config';
import './planets.less';

import PlanetVisual from './planet';

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
		//surface: true,
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

	let [planets, setPlanets] = useState([]);
	let [company, setCompany] = useState({});
	let [filterMaterial, setFilterMaterial] = useState('');
	let [planetResults, setPlanetResults] = useState([]);
	let [filterPlanetTier, setFilterPlanetTier] = useState('');
	let [filterFertility, setFertility] = useState(-1);
	let [distanceTarget, setDistanceTarget] = useState('Moria');
	let materialFilterRef = useRef('');
	let tierFilterRef = useRef('');
	let fertilityFilterRef = useRef('');
	let distanceFilterRef = useRef('');
	let targetFilterRef = useRef('');

	const fetchPlanets = async () => {
		console.log("About to query");

		let planets = await paginate(config.api, 'planetPagination', { filter: {materials: [""]} }, PlanetQuery);
		console.log("planets", planets);
		planets = planets.items.filter((planet) => !!planet.data.resources.length);
		setPlanets(planets);
		return planets;
	}

	useEffect(async () => {
		let planets = await fetchPlanets();
		setPlanetResults(planets);
	}, []);

	const resourcesUnique = _.uniq(_.flatMap(planets.map((planet) => planet.data.resources.map((resource) => resource.material.ticker)))).sort(function (a, b) { return a.localeCompare(b) });

	const onSubmitClick = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		let newMaterialFilter = toUpper(materialFilterRef.current.value);
		let newFertilityFilter = fertilityFilterRef.current.value;
		let newTierFilter = parseInt(tierFilterRef.current.value);
		let maxDistanceFilter = parseInt(distanceFilterRef.current.value);

		let ferilityQuery = (newFertilityFilter === "") ? undefined : { fertility: { lte: parseFloat(newFertilityFilter) } };
		let tierQuery = (tierFilterRef.current.value === "Any") ? undefined : { planetTier: parseInt(tierFilterRef.current.value) };
		let toMoria = (targetFilterRef !== "Moria") ? undefined : maxDistanceFilter;
		let toHortus = (targetFilterRef !== "Hortus") ? undefined : maxDistanceFilter;
		let toBenten = (targetFilterRef !== "Benten") ? undefined : maxDistanceFilter;
		let toAntares = (targetFilterRef !== "Antares") ? undefined : maxDistanceFilter;

		console.log(newMaterialFilter, tierQuery, newFertilityFilter, tierFilterRef.current.value);

		let mat = await query(config.api, 'materialOne', { filter: { ticker: newMaterialFilter } }, MaterialQuery);
		console.log("queryMaterial", mat);
		let filteredPlanets = await paginate(config.api, 'planetPagination', { perPage: 100, filter: { materials: [mat.id], tier: tierQuery, data: ferilityQuery, toMoria, toHortus, toBenten, toAntares } }, PlanetQuery);
		console.log("unfiltered", filteredPlanets);
		filteredPlanets = filteredPlanets.items.filter((planet) => !!planet.data.resources.length);
		// TODO: Sort, Less than/Greater than, Pagination

		console.log("filtered", filteredPlanets);

		setPlanetResults(filteredPlanets);
	};

	// Show what would take to build on the planet

	return (
		<div className='consuption-report container mx-auto p-3'>
			<h1 className='text-xl capitalize inline-block'>Planets --- page loading...</h1>

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
							required="required"
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

						<strong> Fertility </strong>
						<input type='number'
							id='fertilityFilter'
							step="any"
							name='fertilityFilter'
							className='mr-2 text-white'
							placeholder='0-1, leave blank if all'
							ref={fertilityFilterRef}
							title="Fertility should be a number between 0 and 1. -1 is for all."
						/>

						<strong> Max Distance </strong>
						<input type='number'
							id='fertilityFilter'
							step="1"
							name='distanceFilter'
							className='mr-2 text-white'
							placeholder='Whole number: 1, 2, 3'
							ref={distanceFilterRef}
							title="Distance needs to be a whole number."
						/>

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

			<div className=''>
				{planetResults.map(planet => (
					<PlanetVisual planet={planet} target={targetFilterRef.current.value} key={ planet.naturalId }/>	
				))}
			</div>
		</div>
	);

}