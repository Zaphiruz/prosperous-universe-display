import React from 'react';
import PlanetMat from './planetMat';

export default ({ planet, target }) => {

	const returnDistance = () => {
		//{ (planet.systemId) ? planet.systemId.distances.toMoria : "" }
		if (target === "Moria") {
			return planet.systemId?.distances?.toMoria;
		}
		else if (target === "Hortus") {
			return planet.systemId?.distances?.toHortus;
		}
		else if (target === "Benten") {
			return planet.systemId?.distances?.toBenten;
		}
		else if (target === "Antares") {
			return planet.systemId?.distances?.toAntares;
        }
		else {
			return "Unknown Target";
        }
	};

	return (
		<div className='bg-gray-400 dark:bg-gray-800 p-2 rounded-md my-2 flex'>

			<div className='flex-none w-40 grid mr-5'>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'>{planet.naturalId} </small>
					<h3 className='text-lg capitalize inline-block'>{planet.name}</h3>
				</div>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'>System </small>
					<h3 className='text-lg capitalize inline-block'>{planet.systemId.name}</h3>
				</div>
				<div className='nowrap mr-1'>
					<small className='text-gray-500 dark:text-gray-400 mr-2'>Fertility </small>
					<h3 className='text-lg capitalize inline-block'>{planet.data.fertility.toFixed(2)}</h3>
				</div>
				<div className='nowrap mr-1'>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> Plots open </small>
					<h3 className='text-lg capitalize inline-block'>{planet.data.plots - planet.data.takenPlots} </h3>
				</div>
				<div className='nowrap mr-1'>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> Type </small>
					<h3 className='text-lg capitalize inline-block'>{(planet.data.surface ? "MCG 4/u" : "AEF .33/u")} </h3>
				</div>
			</div>

			<div className="flex-none w-40 grid mr-5">
				<h3 className='text-lg capitalize inline-block'>  Tiers  </h3>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> Overall</small>
					<h3 className='text-lg capitalize inline-block'>{planet.tier.planetTier} </h3>
				</div>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> Gravity</small>
					<h3 className='text-lg capitalize inline-block'>{(planet.tier.gravity === -1) ? "MGC 1" : ((planet.tier.gravity === 1) ? "BL 1" : "Normal ")}</h3>
				</div>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> Pressure</small>
					<h3 className='text-lg capitalize inline-block'>{(planet.tier.pressure === -1) ? "SEA 1/u" : ((planet.tier.pressure === 1) ? "HSE 1 " : "Normal ")}</h3>
				</div>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> Temperature</small>
					<h3 className='text-lg capitalize inline-block'>{(planet.tier.temperature === -1) ? "INS 10/u" : ((planet.tier.temperature === 1) ? "TSH 1 " : "Normal ")}</h3>
				</div>
			</div>

			<div className="flex-none w-40 grid mr-5">
				<h3 className='text-lg capitalize inline-block'>  Distances  </h3>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> To Antares</small>
					<h3 className='text-lg capitalize inline-block'>{planet.systemId.distances.toAntares}</h3>
				</div>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> To Benten</small>
					<h3 className='text-lg capitalize inline-block'>{planet.systemId.distances.toBenten}</h3>
				</div>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> To Hortus</small>
					<h3 className='text-lg capitalize inline-block'>{planet.systemId.distances.toHortus}</h3>
				</div>
				<div>
					<small className='text-gray-500 dark:text-gray-400 mr-2'> To Moria</small>
					<h3 className='text-lg capitalize inline-block'>{planet.systemId.distances.toMoria}</h3>
				</div>
			</div>

			<div className="flex-grow-0 grid">
				{planet.data.resources.map((resource) => (
					<PlanetMat resource={resource} key={planet.naturalId + "." + resource.material.ticker} />
				))}
			</div>

		</div>
	);
}