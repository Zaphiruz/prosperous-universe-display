import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
 } from "react-router-dom";
import './app.less';

import Home from './pages/home/home';
import Materials from './pages/materials/materials';

export default () => (
	<div className="App">
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/materials">Materials</Link>
						</li>
					</ul>
				</nav>
			</div>

			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/materials" component={Materials} />
			</Switch>
		</Router>
	</div>
);
