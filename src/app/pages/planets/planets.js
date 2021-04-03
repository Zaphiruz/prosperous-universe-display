import React, { useState, useEffect } from 'react';
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
		temperature: true
	},
	governor: true,
	id: true,
	name: true,
	nameable: true,
	namer: true,
	namingDate: true,
	naturalId: true,
	planetId: true,
	populationId: true
};

export default () => {
	console.log("Loading page...");

	let [planets, setPlanets] = useState([]);
	let [company, setCompany] = useState({});

	const fetchPlanets = async () => {
		console.log("About to query");
		let planets = await query(config.api, 'planetMany', {}, PlanetQuery);
		planets = planets.filter((planet) => !!planet.data.resources.length);
		setPlanets(planets);
		return planets;
	}

	useEffect(async () => {
		let planets = await fetchPlanets();
	}, []);

	const resourcesUnique = _.uniq(_.flatMap(planets.map((planet) => planet.data.resources.map((resource) => resource.material.ticker)))).sort(function (a, b) { return a.localeCompare(b) });

	return (
		<div className='consuption-report container mx-auto p-3'>
			<h1 className='text-xl capitalize inline-block'>Planets --- page loading...</h1>

			<div>
				<label>
					<strong> Filter:</strong>
					<select className="text-black">
						<option key="All" value="">All</option>
						{resourcesUnique.map(mat => (
							<option key={mat} value={mat}> {mat} </option>
						))}
					</select>
				</label>
			</div>

			<div className=''>
				{planets.map(planet => (
					<PlanetVisual planet={planet} key={ planet.naturalId }/>	
				))}
			</div>
		</div>
	);

}