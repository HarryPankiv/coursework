import React from 'react';
import ItemSingle from '../ItemSingle';
import fire from '../fire';

export default class TasksPart1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = { loading: true, humidity: 0, highestPressure: [], lowestPressure: [], electricityDays: []};
		this.loadDatabase = this.loadDatabase.bind(this);
		this.countHumidity = this.countHumidity.bind(this);
		this.fillState = this.fillState.bind(this);
		this.loadingScreen = this.loadingScreen.bind(this);
	}

	loadDatabase(){
		this.items = [];
		let itemsRef = fire.database().ref().orderByKey().limitToLast(100);
		itemsRef.on('child_added', snapshot => {
			this.items.push(snapshot.val());
			setTimeout( this.fillState, 0);
			setTimeout( this.countHumidity, 0);
		})
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

	countHumidity() {
		let items = this.items;
		let today = new Date();
		let currentMonth = items.map( (item) => { return item.date.split('-')[1] != today.getMonth() ? item : undefined 
		}).filter( (item) => { return item != undefined });

		let humidity = 'Average humidity is - ' + currentMonth.reduce( (a, item, index, array) => { return a + item.humidity / array.length}, 0);
		this.setState({humidity: humidity})

		let dayWithHighestPressure = items.reduce( (a, item) => {
			if(+a.pressure > +item.pressure) {
				return a;
			} else  { 
				return item;
			}
		});
		this.setState({highestPressure: [dayWithHighestPressure]})

		let dayWithLowestPressure = items.reduce( (a, item) => {
			if(+a.pressure < +item.pressure) {
				return a;
			} else { 
				return item;
			}
		});
		this.setState({lowestPressure: [dayWithLowestPressure]})

		let electricityDays = items.map( item => {
			return item.electricity > 5 ? item : undefined;
		}).filter( (item) => { return item != undefined });
		this.setState({electricityDays: electricityDays})
	}

	loadingScreen() {
		this.setState({loading: false});
	}

	componentDidMount() {
		this.loadDatabase();
		this.loadingScreen();
	}

	render() {
		console.log(this.state.loading);
		return this.state.loading ? 
			<div className="preloader-wrapper small active">
				<div className="spinner-layer spinner-yellow-only">
					<div className="circle-clipper left">
						<div className="circle"></div>
					</div><div className="gap-patch">
						<div className="circle"></div>
					</div><div className="circle-clipper right">
						<div className="circle"></div>
					</div>
				</div>
			</div> : 
			<div>
				<div className="col s12">{this.state.humidity}</div>
				<ul className="col s12 row container">
					<li className="col s2">date</li>
					<li className="col s2">temperature</li>
					<li className="col s2">pressure</li>
					<li className="col s2">humidity</li>
					<li className="col s2">electricity</li>
				</ul>
				<div>Day with lowest pressure is :  </div>
				<div className="col s12">{this.state.lowestPressure.map( (item) => { return <ItemSingle key={item.date} item={item} deleteItem={this.deleteItem.bind(this)} />})}</div>
				<div>Day with highest pressure is : </div>
				<div className="col s12">{this.state.highestPressure.map( (item) => { return <ItemSingle key={item.date} item={item} deleteItem={this.deleteItem.bind(this)} />})}</div>
				<div>Days with connsumption of electricity higher 5kw : </div>
				<ul>
					{this.state.electricityDays.map( (item) => { return <ItemSingle key={item.date} item={item} deleteItem={this.deleteItem.bind(this)}/> } ) }
				</ul>
			</div>
	}
}