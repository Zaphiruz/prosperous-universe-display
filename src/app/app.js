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
import CompanyPicker from './pages/company-picker/company-picker';
import ProductionReport from './pages/production-report/production-report';
import ShippingCalc from './pages/shipping-calc/shipping-calc';
import Planets from './pages/planets/planets';
import RepairCalc from './pages/repair-calc/repair-calc';
import BasePlanner from './pages/base-planner/base-planner';
import CorpReport from './pages/corp-report/corp-report';

export default () => (
	<div className="app w-full h-full min-h-screen min-w-full dark:bg-gray-900 dark:text-white">
		<Router>
			<Nav />

			<Switch>
				<Route path="/" exact component={Home} />
				<Route path='/consumption-report' exact component={CompanyPicker} />
				<Route path='/production-report' exact component={CompanyPicker} />
				<Route path='/repair-calc' exact component={CompanyPicker} />
				<Route path='/consumption-report/:companyId' component={ConsumptionReport} />
				<Route path='/production-report/:companyId' component={ProductionReport} />
				<Route path='/repair-calc/:companyId' component={RepairCalc} />
				<Route path='/corp-report' component={CorpReport} />
				<Route path='/shipping-calc' component={ShippingCalc} />
				<Route path='/planets' component={Planets} />
				<Route path='/base-planner' component={BasePlanner} />
			</Switch>
		</Router>
	</div>
);
