import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request'
import './materials.less';

export default () => {

	useEffect(() => {
		fetchMaterials();
	}, [])

	const [materials, setMaterials] = useState([]);

	const fetchMaterials = async () => {
		let query = await request('http://localhost:8000/graphql', gql`
			query {
				materialMany {
					name,
					id,
					weight,
					volume,
					category {
						 name
					}
			  }
			}
		`);
		console.log(query.materialMany);
		setMaterials(query.materialMany);
	}

	return (
		<div className='materials'>
			<h1>Materials</h1>

			<div class='grid grid-cols-2'>
				{materials.map(material => (
					<div key={material.id} className='max-w-sm'>
						<h3>{material.name} <small className='text-gray-500'>{material.id}</small></h3>
						<div className='grid grid-flow-row grid-cols-2 gap-2'>
							<dl>
								<dt>weight</dt>
								<dl>{material.weight}</dl>
							</dl>

							<dl>
								<dt>volume</dt>
								<dl>{material.volume}</dl>
							</dl>

							<dl>
								<dt>category</dt>
								<dl>{material.category?.name}</dl>
							</dl>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
