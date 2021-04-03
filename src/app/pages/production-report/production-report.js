import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { query } from 'UTILS/graphql-query-helper';
import { toUpper, startCase } from 'lodash';
import config from 'ROOT/config';
import './production-report.less';


export default () => {

	return (
		<div className='consuption-report container mx-auto p-3'>
			<h1 className='text-xl capitalize inline-block'>Production report - page loading...</h1>
		</div>
	);

}