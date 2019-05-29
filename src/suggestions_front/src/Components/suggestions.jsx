import React, { Component } from 'react';
import SelectLocation from './SelectLocation';
import MapContainer from './maps-container';

class Suggestions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			zoom: 11,
			isMarkerShown: true
		};
	}

	applyPositions = (name, lat, long) => {
		// TODO: apply positions latitude and longitude to google maps
		console.log({name});
		this.setState({
			passedName: name,
			passedLat: lat,
			passedLong: long,
		})
	}

	render() {
		const { value} = this.state;
		const { passedName, passedLat, passedLong } = this.state;
		console.log({value});
		return (
			<div >
				<div style={{height:'100px'}}>
					<SelectLocation
							applyPositions={this.applyPositions}
							/>
				</div>

				<MapContainer
					passedLat={passedLat}
					passedLong={passedLong}
					passedName={passedName}
				/> 
			</div>
		);
	  }
}

export default Suggestions;