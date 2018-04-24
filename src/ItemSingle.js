import React, { Component } from 'react'

export default class ItemSingle extends Component {
	render() {
		return (
			<ul className="col s12 row container">
				<li className="col s2">{this.props.item.date}</li>
				<li className="col s2">{this.props.item.temperature}</li>
				<li className="col s2">{this.props.item.pressure}</li>
				<li className="col s2">{this.props.item.humidity}</li>
				<li className="col s2">{this.props.item.electricity}</li>
				<button className="col s1 amber waves-effect waves-light btn submit-button offset-s1"
					onClick={() => this.props.deleteItem(this.props.item.date)}
					>
					&times;
				</button>
			</ul>
		)
	}
}