import React from 'react';
import ItemSingle from '../ItemSingle';
import fire from '../fire';
import './InputStyle.css';

export default class TasksPart2 extends React.Component {
	constructor(props) {
		super(props);
		this.state = ({ items: [], temperature: '', submit: false, finalPressure: [], finalTemperature: [], highestHumidity: '' });
		this.loadDatabase = this.loadDatabase.bind(this);
		this.fillState = this.fillState.bind(this);
	}

	loadDatabase(){
		this.items = [];
		let itemsRef = fire.database().ref().limitToLast(100);
		itemsRef.on('child_added', snapshot => {
			this.items.push(snapshot.val());
			setTimeout( this.fillState, 0 );
		});
	}

	fillState() {
		let items = this.items;
		this.setState({items: items});
	}

	deleteItem(item) {
		let itemRef = fire.database().ref(item).orderByKey().limitToLast(100);
		itemRef.on('value', (snapshot) => {
			itemRef.ref.remove();
		})
		this.loadDatabase();
		this.fillState();
	}

	componentDidMount() {
		this.loadDatabase();
	}

	countPeriod(e) {
		e.preventDefault();
		let periodStart = this.refs.periodStart.value;
		let periodEnd = this.refs.periodEnd.value;

		let items = this.state.items;

		let matched = items.map( (item) => {
			return item.date > periodStart && item.date < periodEnd ? item : undefined
		}).filter( (item) => { return item != undefined });

		let temperature = 'Average temperature is - ' + matched.reduce( (a, item, index, array) => { return a + item.temperature / array.length}, 0).toFixed(1);
		this.setState({temperature: temperature})

		let dayWithHighestHumidity = matched.reduce( (a, item) => {
			if(+a.pressure > +item.pressure) {
				return a;
			} else  { 
				return item;
			}
		});
		this.setState({highestHumidity: dayWithHighestHumidity.date});
		this.setState({submit: true});
	}

	countAmp() {
		let multiplier = 1.0143;
		let items = this.state.items;
		let matched = [];
		let finalPressure = [];
		let finalTemperature = [];
		for(let i = 0; i < items.length; i++) {
			let highAmp = items[i].pressure * multiplier;
			let lowAmp = items[i].pressure / multiplier;
			for(let j = i; j < items.length; j++) {
				if (items[j].pressure < highAmp && items[j].pressure > lowAmp) {
					matched.push(items[j].date);
				} else break;
			}
			if( matched.length > 1 ) finalPressure.push(matched);
			matched = [];
		}

		finalPressure.forEach( (item, index, array) => {
			if (array[index + 1] !== undefined) {
				if(item[item.length] === array[index + 1][item.length]) {
					array.splice(index + 1, 1);
				}
			}
		})

		let newMultiplier = 1.05673;

		for(let i = 0; i < items.length; i++) {
			let highAmp = items[i].temperature * newMultiplier;
			let lowAmp = items[i].temperature / newMultiplier;
			for(let j = i; j < items.length; j++) {
				if (items[j].temperature < highAmp && items[j].temperature > lowAmp) {
					matched.push(items[j].date);
				} else break;
			}
			if( matched.length > 1 ) finalTemperature.push(matched);
			matched = [];
		}

		finalTemperature.forEach( (item, index, array) => {
			if (array[index + 1] !== undefined) {
				if(item[item.length] === array[index + 1][item.length]) {
					array.splice(index + 1, 1);
				}
			}
		})
	
		return (<div>
			<h6>Pressure amplitude periods : </h6>
			{finalPressure.map( (item) => { return <p>{item[0]} - {item[item.length - 1]}</p>;})}
			<h6>Temperature amplitude periods : </h6>
			{finalTemperature.map( (item) => { return <p>{item[0]} - {item[item.length - 1]}</p>;})}
		</div>
		)
	}

	predictElectricity() {
		let months = [ 1.2, 0.9, 0.8, 0.9, 1, 1, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1];

		let items = this.state.items;

		let today = new Date();
		let prevMonth = today.getMonth();
		let currentItems = items.map( (item) => { return item.date.split('-')[1] != today.getMonth() ? item : undefined 
		}).filter( (item) => { return item != undefined });

		let electricity = currentItems.reduce( (a, item, index, array) => { return a + +item.electricity}, 0);
		
		let predict = (electricity * months[prevMonth]).toFixed(1);

		return (<h5>Approximate electricity consumption for next month will be - {predict}</h5>)
	}

	render() {
		return (
			<div className="col s12 row container">
				<h5> Enter period: </h5>
				<form className="col s12 row container" onSubmit={this.countPeriod.bind(this)}>
					<div className="col s3 input-field">
						<input className="datepicker unstyled"
							   type="date"
							   ref="periodStart"
							   min="2016-01-01"
							   max="2018-01-01"
							   required/>
					</div>
					<div className="col s3 input-field">
						<input className="datepicker unstyled"
							   type="date"
							   ref="periodEnd"
							   min="2016-01-01"
							   max="2018-01-01"
							   required/>
					</div>
					<input type="submit" 
							className="col offset-s1 s2 amber waves-effect waves-light btn submit-button btn-login" 
							value="submit"/>
				</form>
				<div> {this.state.submit ? this.state.temperature : null } </div>
				<div> {this.state.submit ? 'Day day with highest humidity - ' + this.state.highestHumidity : null} </div>
				<h5> Amplitude: </h5>
				{this.countAmp()}
				{this.predictElectricity()}
			</div>
		)
	}
}