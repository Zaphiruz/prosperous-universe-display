import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { query, paginate } from 'UTILS/graphql-query-helper';
import { toUpper, startCase, uniq, flatMap, localeCompare } from 'lodash';
import config from 'ROOT/config';
import './corp-report.less';

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

	let [planetResults, setPlanetResults] = useState([]);
	let [distanceTarget, setDistanceTarget] = useState('Moria');

	let [paginationPage, setPaginationPage] = useState(1);
	let [paginationMax, setPaginationMax] = useState(-1);
	let [pageLoadState, setPageLoadState] = useState(0);

	let materialFilterRef = useRef('');

	useEffect(async () => {
		//let planets = await fetchPlanets();
		//setPlanetResults(planets);
		paginateQuery(1, 50);
	}, []);


	return (
		<div className='corp-report container mx-auto p-3'>
			<div>
				<h3>Corp Report temp page</h3>
			</div>
		</div>
	);

}