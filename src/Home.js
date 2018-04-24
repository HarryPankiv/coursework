import React, { Component } from 'react';
import fire from './fire';
import ItemSingle from "./ItemSingle";
import './components/InputStyle.css';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = ({items: [], fileUploader: false, fileError: false})
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

	addItem(e){
		e.preventDefault();

		let item = {
			"date": this.refs.date.value,
			"temperature": this.refs.temperature.value,
			"pressure": this.refs.pressure.value,
			"humidity": this.refs.humidity.value,
			"electricity": this.refs.electricity.value,
		}

		fire.database().ref(this.refs.date.value).set(item);
		this.refs.date.value = '';
		this.refs.temperature.value = '';
		this.refs.pressure.value = '';
		this.refs.humidity.value = '';
		this.refs.electricity.value = '';
		console.log(this.state);
	}

	componentDidMount() {
		this.loadDatabase();
	}

	loadFile() {
		this.refs.filename=document.getElementById('upload').files[0].name;
		let file = document.getElementById('upload').files[0];
		let filename = document.getElementById('upload').files[0].name;
		let fileStorageRef = fire.storage().ref(filename);
		let task = fileStorageRef.put(file);
		task.on('state_changed', 
			(snapshot) => {
				let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				this.setState({fileUploader: true});
			},

			() => {

			},
			 () => {
				this.setState({fileUploader: false});
			}
		)
		let reader = new FileReader();


		let promise = Promise.resolve(0);
		reader.onload = ( (file) => {
			promise.then( () => {
				return JSON.parse(file.target.result);
			}).then( (data) => {
				fire.database().ref().set(data);
				this.setState({fileError: false})
			}).catch( (err) => {
				this.setState({fileError: true});
			})
		})
		reader.readAsText(file);
	}

	render() {
		return (
			<div className="row">
				<div className="row">
					<div className="file-field input-field col s6">
						<div className="btn amber">
							<span>FILE</span>
							<input className="" name="upload" id="upload" accept=".json" type="file" onChange={this.loadFile.bind(this)}/>
						</div>
						<div className="file-path-wrapper">
							<input className="file-path validate" type="text" ref="filename"></input>
						</div>
					</div>
				{this.state.fileUploader ? 
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
					</div> : null
				}
				</div>
				{this.state.fileError ? <div className="container"> File not uploaded, check if data is correct </div> : null}
				<form className="container col s12 row" onSubmit={this.addItem.bind(this)}>
				
				<div className='input-field col s2'>
				<input className="datepicker"
					 id="dateInput"
					 type="date"
					 ref="date"
					 min="2016-01-01"
					 max="2018-01-01"
					 required/>
				</div>

				<div className='input-field col s2'>
				<input className=""
					 type='number'
					 ref='temperature'
					 min='-10'
					 max='40'
					 required />
					 <label htmlFor='temperature'>temperature</label>
				</div>

				<div className='input-field col s2'>
				<input className=""
					 type='number'
					 ref='pressure'
					 min='0'
					 max='100'
					 required />
					 <label htmlFor='pressure'>pressure</label>
				</div>

				<div className='input-field col s2'>
				<input className=""
					 type='number'
					 ref='humidity'
					 min='0'
					 max='100'
					 required />
					 <label htmlFor='humidity'>humidity</label>
				</div>

				<div className='input-field col s2'>
				<input className=""
					 type='number'
					 ref='electricity'
					 min='0'
					 max='100'
					 required />
					 <label htmlFor='electricity'>electricity</label>
				</div>

				<input type="submit" className="col s2 amber waves-effect waves-light btn submit-button btn-login"/>
				</form>
				<ul>
					{this.state.items.map( (item) => { return <ItemSingle key={item.date} item={item} deleteItem={this.deleteItem.bind(this)}/> } ) }
				</ul>
			</div>
		);
	}
}