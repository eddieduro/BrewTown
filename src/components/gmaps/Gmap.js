import React from 'react';
import {Gmaps, Marker, InfoWindow} from 'react-gmaps';


class Gmap extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      coords: [{lat: null,
               lng: null
             }],
      infoWindows: [false]

    };
    this.onMapCreated = this.onMapCreated.bind(this);
    this.renderInfoWindows = this.renderInfoWindows.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.toggleInfoWindow = this.toggleInfoWindow.bind(this);
  }



  onMapCreated(map) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let coords = this.state.coords;

        coords.lat = position.coords.latitude;
        coords.lng = position.coords.longitude;
        this.setState({ coords: coords });
      },
      (error) => alert(error.message)
    );
  }

  renderInfoWindows() {
    const {infoWindows} = this.state;
    return this.state.coords.map((coords, index) => {
      if (!infoWindows[index]) return null;
      return (
        <InfoWindow
          key={index}
          lat={this.state.coords.lat}
          lng={this.state.coords.lng}
          onCloseClick={() => this.toggleInfoWindow(index)}
        />
      );
    });
  }

  toggleInfoWindow(index) {
    const {infoWindows} = this.state;
    infoWindows[index] = !infoWindows[index];
    this.setState({
      infoWindows
    });
  }

  renderMarkers() {
    return this.state.coords.map((coords, index) =>
      <Marker
        key={index}
        lat={this.state.coords.lat}
        lng={this.state.coords.lng}
        onClick={() => this.toggleInfoWindow(index)}
      />
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
        width={800}
        height={600}
        lat={this.state.coords.lat}
        lng={this.state.coords.lng}
        zoom={12}
        loadingMessage={'Finding beers near you'}
        params={{v: '3.exp', key: 'AIzaSyBJkpYAu46PQfND0jbbgYb40loKjJYetf8'}}
        onMapCreated={this.onMapCreated}>
        {this.renderMarkers()}
        {this.renderInfoWindows()}
      </Gmaps>
    );
  }
}

export default Gmap;
