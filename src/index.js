import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './Home';
import Tasks from './components/Tasks';
import Graph from './components/Graph';
import TemperatureGraph from './components/TemperatureGraph';
import PressureGraph from './components/PressureGraph';
import HumidityGraph from './components/HumidityGraph';
import TasksPart1 from './components/TasksPart1';
import TasksPart2 from './components/TasksPart2';
import Help from './components/Help';

ReactDOM.render( 
	<BrowserRouter>
		<div>
			<Route path='/' component={Layout}></Route>
			<Route path='/home' component={Home}></Route>
			<Route path='/tasks' component={Tasks}></Route>
			<Route path='/tasks/part1' component={TasksPart1}></Route>
			<Route path='/tasks/part2' component={TasksPart2}></Route>
			<Route path='/help' component={Help}></Route>
			<Route path='/graph' component={Graph}></Route>
			<Route path='/graph/temperature' component={TemperatureGraph}></Route>
			<Route path='/graph/pressure' component={PressureGraph}></Route>
			<Route path='/graph/humidity' component={HumidityGraph}></Route>
		</div>      
	</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
