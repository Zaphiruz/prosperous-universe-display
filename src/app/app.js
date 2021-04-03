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
import ConsumptionReport from './pages/consumption-report/consumption-report';
import ProductionReport from './pages/production-report/production-report';
import ShippingCalc from './pages/shipping-calc/shipping-calc';

export default () => (
	<div className="App w-full h-full min-h-screen min-w-full dark:bg-gray-900 dark:text-white">
		<Router>
			<Nav />

			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/materials" component={Materials} />
				<Route path='/consumption-report/:companyId' component={ConsumptionReport} />
				<Route path='/production-report/:companyId' component={ProductionReport} />
				<Route path='/shipping-calc' component={ShippingCalc} />
			</Switch>
		</Router>
	</div>
);
