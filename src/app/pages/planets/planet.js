import React from 'react';
import PlanetMat from './planetMat';

export default ({ planet }) => {
	return (
		<div className='bg-gray-400 dark:bg-gray-800 p-2 rounded-md my-2'>
			<span>
				<small className='text-gray-500 dark:text-gray-400 mr-2'>{planet.naturalId} </small>
				<h3 className='text-lg capitalize inline-block'>{planet.naturalId} </h3>
			</span>
			<span>
				<small className='text-gray-500 dark:text-gray-400 mr-2'>Fertility</small>
				<h3 className='text-lg capitalize inline-block'>{planet.data.fertility}</h3>
			</span>
			<h3 className='text-lg capitalize inline-block'>  Tiers  </h3>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>Overall</small>
			<h3 className='text-lg capitalize inline-block'>{planet.tier.planetTier}</h3>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>Gravity</small>
			<h3 className='text-lg capitalize inline-block'>{(planet.tier.gravity === -1) ? "Low" : ((planet.tier.gravity === 1) ? "High": "Normal")}</h3>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>Pressure</small>
			<h3 className='text-lg capitalize inline-block'>{(planet.tier.pressure === -1) ? "Low" : ((planet.tier.pressure === 1) ? "High" : "Normal")}</h3>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>Temperature</small>
			<h3 className='text-lg capitalize inline-block'>{(planet.tier.temperature === -1) ? "Low" : ((planet.tier.temperature === 1) ? "High" : "Normal")}</h3>

			<div>
				{planet.data.resources.map((resource) => (
					<PlanetMat resource={resource} key={planet.naturalId + "." + resource.material.ticker} />
				))}
			</div>

		</div>
	);
}