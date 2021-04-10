import React from 'react';
import { capitalize } from 'lodash'

export default ({ line }) => {

	return (
		<div className={`p-2 rounded-md bg-gray-400 dark:bg-gray-800`}>
			<small className='text-gray-500 dark:text-gray-400 mr-2'>{line.type}</small>
		</div>
	)
}