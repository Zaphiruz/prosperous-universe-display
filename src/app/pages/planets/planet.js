import React from 'react';
import PlanetMat from './planetMat';

export default ({ planet }) => {
	return (
		<div className='bg-gray-400 dark:bg-gray-800 p-2 rounded-md my-2'>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>{planet.naturalId}</small>
			<h3 className='text-lg capitalize inline-block'>{planet.naturalId}</h3>

			<div>
				{planet.data.resources.map((resource) => (
					<PlanetMat resource={resource} key={planet.naturalId + "." + resource.material.ticker} />
				))}
			</div>

		</div>
	);
}