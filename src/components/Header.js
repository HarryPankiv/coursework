import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default class Header extends React.Component {
	render() {
		return (
			<nav>
				<ul className="col s12 row nav-wrapper amber">
					<li className="col s2 nav-item center"><Link to="/home">Home</Link></li>
					<li className="col s2 nav-item center"><Link to="/tasks">Tasks</Link></li>
					<li className="col s2 nav-item center"><Link to="/graph">Graph</Link></li>
					<li className="col s2 nav-item center"><Link to="/help">Help</Link></li>
				</ul>
			</nav>
		)
	}
}