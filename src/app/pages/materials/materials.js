import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';
import './materials.less';

import MaterialCard from './material-card';

export default () => {

	useEffect(() => {
		fetchMaterials();
	}, [])

	const [materials, setMaterials] = useState([]);

	const fetchMaterials = async () => {
		let query = await request('https://api.prosperon.app/graphql', gql`
			query {
				materialMany {
					name,
					ticker
					id,
					weight,
					volume,
					category {
						 name
					}
			  }
			}
		`);
		setMaterials(query.materialMany);
	}

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
