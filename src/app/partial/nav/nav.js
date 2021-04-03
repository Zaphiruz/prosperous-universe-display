import React from 'react';
import { Link } from "react-router-dom";

export default () => (
	<nav className='mb-2'>
		<ul className='flex justify-center'>
			<li>
				<Link className='mx-2 font-bold' to="/">Home</Link>
			</li>
			<li>
				<Link className='mx-2 font-bold' to="/materials">Materials</Link>
			</li>
			<li>
				<Link className='mx-2 font-bold' to="/shipping-calc">Shipping Calc</Link>
			</li>
		</ul>
	</nav>
)
