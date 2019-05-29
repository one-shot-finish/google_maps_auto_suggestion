import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {

  render() {
	  const { passedName='', passedLat=60.2884, passedLong=-116.8233 } = this.props;
    return (
      <Map
		google={this.props.google}
		
        zoom={5}
        style={mapStyles}
        initialCenter={{
         lat: 60.2884,
         lng: -116.8233
        }}>
		<Marker 
				name={passedName}
				position={{lat: passedLat, lng: passedLong}} 
		/>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB1AFwneRBIEyAtaico2TkKbihonkQrrzg'
})(MapContainer);
