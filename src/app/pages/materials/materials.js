import React, { useState, useEffect } from 'react';
import { query } from 'UTILS/graphql-query-helper';
import config from 'ROOT/config';
import './materials.less';

import MaterialCard from './material-card';

const materialQuery = {
	name: true,
	ticker: true,
	id: true,
	weight: true,
	volume: true,
	category: {
		name: true
	}
}

export default () => {
	const [materials, setMaterials] = useState([]);

	const fetchMaterials = async () => {
		let materials = await query(config.api, 'materialMany', null, materialQuery);
		setMaterials(materials);
	}

	useEffect(() => {
		fetchMaterials();
	}, []);

	return (
		<div className='materials container mx-auto'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{materials.map(material => (
					<MaterialCard material={material} key={material.id} />
				))}
			</div>
		</div>
	);
}
