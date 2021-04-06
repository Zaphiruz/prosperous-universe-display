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

export default () => {
	console.log("Loading page...");

	let [planets, setPlanets] = useState([]);
	let [company, setCompany] = useState({});
	let [filterMaterial, setFilterMaterial] = useState('');
	let [planetResults, setPlanetResults] = useState([]);
	let [filterPlanetTier, setFilterPlanetTier] = useState('');
	let [filterFertility, setFertility] = useState(-1);

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

	const handleMaterialSearchChange = event => {
		setFilterMaterial(event.target.value);
	};

	const handleTierSearchChange = event => {
		setFilterPlanetTier(event.target.value);
		console.log(event.target.value);
	};

	const handleFertilitySearchChange = event => {
		setFertility(parseFloat(event.target.value));
	};

	const onSubmitClick = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		console.log("!");
	};

	React.useEffect(() => {

		//let planets = await query(config.api, 'planetMany', { filterMaterial }, PlanetQuery);
		planets = planets.filter((planet) => !!planet.data.resources.length);
		let filteredPlanetsSet = planets;

		// Material Filter
		if (filterMaterial) {
			filteredPlanetsSet = filteredPlanetsSet.filter(planet =>
				planet.data.resources.some(mat =>
					mat.material.ticker === filterMaterial)
			).sort(function (a, b) {
				return b.data.resources.find(resource => resource.material.ticker === filterMaterial).factor - a.data.resources.find(resource => resource.material.ticker === filterMaterial).factor
			});
		}

		// filter by fertility
		if (filterFertility != -1) {
			filteredPlanetsSet = filteredPlanetsSet.filter(planet =>
				planet.data.fertility >= filterFertility);
        }

		// filter by planet tier
		if (filterPlanetTier != 0) {
			filteredPlanetsSet = filteredPlanetsSet.filter(planet =>
				planet.tier.planetTier >= filterPlanetTier);
        }

		setPlanetResults(filteredPlanetsSet);

	}, [filterMaterial, filterPlanetTier, filterFertility]);


	// Show what would take to build on the planet

	return (
		<div className='consuption-report container mx-auto p-3'>
			<h1 className='text-xl capitalize inline-block'>Planets --- page loading...</h1>

			<div>
				<form onSubmit={onSubmitClick}>
					<label>
						<strong> Filter:</strong>
						<select className="text-black" id='materialFilter' onChange={handleMaterialSearchChange}>
							{resourcesUnique.map(mat => (
								<option key={mat} value={mat}> {mat} </option>
							))}
						</select>

						<strong> Planet Tier: </strong>
						<select className="text-black" id='tierFilter' onChange={handleTierSearchChange}>
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
							placeholder='-1'
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