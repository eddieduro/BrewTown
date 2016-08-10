import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Gmaps, Marker, InfoWindow} from 'react-gmaps';


class Gmap extends React.Component {
  constructor(props, context){
    super(props, context);

    this.state = {
      coords: {lat: null,
               lng: null
              }
    };
    console.log(this.state.coords);
    this.onMapCreated = this.onMapCreated.bind(this);
  }

  onMapCreated(map) {



  navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        var coords = this.state.coords;
        coords.lat = position.coords.latitude;
        coords.lng = position.coords.longitude;
        this.setState({ coords: coords });
        console.log(coords);


      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  onDragEnd(e) {
    console.log('onDragEnd', e);
  }

  onCloseClick() {
    console.log('onCloseClick');
  }

  onClick(e) {
    console.log('onClick', e);
  }

  render() {
    return (
      <Gmaps
        width={'800px'}
        height={'600px'}
        lat={this.state.coords.lat}
        lng={this.state.coords.lng}
        zoom={12}
        loadingMessage={'Finding beers near you'}
        params={{v: '3.exp', key: 'AIzaSyBJkpYAu46PQfND0jbbgYb40loKjJYetf8'}}
        onMapCreated={this.onMapCreated}>
        <Marker
          lat={this.state.coords.lat}
          lng={this.state.coords.lng}
          draggable={false}
          onDragEnd={this.onDragEnd} />
        <InfoWindow
          lat={this.state.coords.lat}
          lng={this.state.coords.lng}
          content={''}
          onCloseClick={this.onCloseClick} />
      </Gmaps>
    );
  }
}

export default Gmap;
