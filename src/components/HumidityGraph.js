import React from 'react';
import fire from '../fire';
import { Chart } from 'chart.js'


export default class HumidityGraph extends React.Component {
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
		let humidity = currentMonth.map( (item) => { return item.humidity })
		let ctx = document.getElementById('humidity');
		let Graph = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: date,
				datasets: [{
					label: "Humidity Graph",
					backgroundColor: '#ffc107',
					borderColor: '#ffc107',
					data: humidity
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
				<canvas id="humidity" width="400" height="200"></canvas>
			</div>
		)
	}
}