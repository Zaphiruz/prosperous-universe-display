import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { query } from 'UTILS/graphql-query-helper';
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
	cogcId: true,
	country: true,
	currency: true,
	data: {					// Errors out
		fertility: true,
		gravity: true,
		magneticField: true,
		mass: true,
		massEarth: true,
		orbitIndex: true,
		plots: true,
		pressure: true,
		radiation: true,
		radius: true,
		resources: {
			factor: true,
			type: true,
			material: {
				id: true,
				ticker: true,
				name: true
			}
		},
		sunlight: true,
		surface: true,
		temperature: true,
		takenPlots: true
	},
	governor: true,
	id: true,
	name: true,
	nameable: true,
	namer: true,
	namingDate: true,
	naturalId: true,
	planetId: true,
	populationId: true,
	tier: {
		gravity: true,
		pressure: true,
		temperature: true,
		planetTier: true
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
	let materialFilterRef = useRef('');
	let tierFilterRef = useRef('');
	let fertilityFilterRef = useRef('');

	const fetchPlanets = async () => {
		console.log("About to query");
		let planets = await query(config.api, 'planetMany', {}, PlanetQuery);	//planetMany
		planets = planets.filter((planet) => !!planet.data.resources.length);
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

		console.log(newMaterialFilter, newTierFilter);

		let mat = await query(config.api, 'materialOne', { ticker: newMaterialFilter }, MaterialQuery);
		console.log(mat);
		let filteredPlanets = await query(config.api, 'planetMany', { materials: [mat.id], tier: {planetTier: newTierFilter} }, PlanetQuery);

		console.log(filteredPlanets);

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
							className="mr-2 text-black"
							pattern='[a-zA-Z0-9]{1,3}'
							required="required"
							placeholder='i.e. RAT'
							title="Ticker should only contain 1-3 charactors. i.e. RAT, DW, H"
						/>

						<strong> Planet Tier: </strong>
						<select className="text-black" id='tierFilter' ref={ tierFilterRef }>
							<option key="3" value="3">3</option>
							<option key="2" value="2">2</option>
							<option key="1" value="1">1</option>
							<option key="0" value="0">0</option>
						</select>

						<strong> Fertility </strong>
						<input type='text'
							id='fertilityFilter'
							name='fertilityFilter'
							className='mr-2 text-black'
							pattern='\d+'
							placeholder='0-1, leave blank if all'
							ref={fertilityFilterRef}
							title="Fertility should be a number between 0 and 1. -1 is for all."
						/>
					</label>

					<button type='submit'>
						<span className="material-icons">add_circle_outline</span>
					</button>
				</form>

			</div>

			<div className=''>
				{planetResults.map(planet => (
					<PlanetVisual planet={planet} key={ planet.naturalId }/>	
				))}
			</div>
		</div>
	);

}