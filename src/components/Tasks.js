import React from 'react';
import { Link } from 'react-router-dom';

export default class Tasks extends React.Component {
	render() {
		return (
			<nav>
				<ul className="col s12 row nav-wrapper amber">
					<li className="col s2 nav-item center"><Link to="/tasks/part1">Part 1</Link></li>
					<li className="col s2 nav-item center"><Link to="/tasks/part2">Part 2</Link></li>
				</ul>
			</nav>
		)
	}
}