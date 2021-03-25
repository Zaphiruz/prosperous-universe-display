import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
 } from "react-router-dom";
import './app.less';

import Nav from './partial/nav/nav';

import Home from './pages/home/home';
import Materials from './pages/materials/materials';
import ConsputionReport from './pages/consuption-report/conspution-report';

export default () => (
	<div className="App w-full h-full min-h-screen min-w-full dark:bg-gray-900 dark:text-white">
		<Router>
			<Nav />

			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/materials" component={Materials} />
				<Route path='/conspution-report/:companyId' component={ConsputionReport} />
			</Switch>
		</Router>
	</div>
);
