import React from 'react';
import { Link } from 'react-router-dom';
import './Graph.css';

export default class Graph extends React.Component {
	render() {
		return (
			<nav>
				<ul className="col s12 row nav-wrapper amber">
					<li className='col s2 nav-item center'><Link to="/graph/temperature">Temperature</Link></li>
					<li className='col s2 nav-item center'><Link to="/graph/pressure">Pressure</Link></li>
					<li className='col s2 nav-item center'><Link to="/graph/humidity">Humidity</Link></li>
				</ul>
			</nav>
		)
	}
}