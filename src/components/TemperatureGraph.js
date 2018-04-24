import React from 'react';
import fire from '../fire';
import { Chart } from 'chart.js'


export default class TemperatureGraph extends React.Component {
	constructor(props) {
		super(props)
		this.loadDatabase = this.loadDatabase.bind(this);
		this.drawGraph = this.drawGraph.bind(this);
	}

	loadDatabase(){
		this.items = [];
		let itemsRef = fire.database().ref().orderByKey().limitToLast(100);
		itemsRef.on('child_added', snapshot => {
			this.items.push(snapshot.val());
			setTimeout( this.drawGraph, 0);
		});
		
	}

	drawGraph() {
		let today = new Date();
		let currentMonth = this.items.map( (item) => { return item.date.split('-')[1] != today.getMonth() ? item : undefined 
		}).filter( (item) => { return item != undefined });

		let date = currentMonth.map( (item) => { return item.date });
		let temperature = currentMonth.map( (item) => { return item.temperature })
		let ctx = document.getElementById('temperature');
		let Graph = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: date,
				datasets: [{
					label: "Temperature Graph",
					backgroundColor: '#ffc107',
					borderColor: '#ffc107',
					data: temperature
				}]
		},
			options: {}
		}); 
	}

	componentDidMount() {
		this.loadDatabase();
	}

	render() {
		return (
			<div>
				<canvas id="temperature" width="400" height="200"></canvas>
			</div>
		)
	}
}