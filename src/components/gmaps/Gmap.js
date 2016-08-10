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
    //get current position based off of browser geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let coords = this.state.coords;
        //set browser coords to state
        coords.lat = position.coords.latitude;
        coords.lng = position.coords.longitude;
        // assign state to coords
        this.setState({ coords: coords });
      }
      // TODO: set default starting coords if geolocation not available
    );
  }

  renderInfoWindows() {
    //render infoWindows as false
    const {infoWindows} = this.state;
    return this.state.coords.map((coords, index) => {
      //for each index of coord objects return an infowindow
      if (!infoWindows[index]) return null;
      return (
        <InfoWindow
          key={index}
          //TODO: render infowindow based on beer api
          lat={this.state.coords.lat}
          lng={this.state.coords.lng}
          //TODO: fill content for each window with data from beer api
          content={'yo'}
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
    //for each index of coord objects return a marker
    return this.state.coords.map((coords, index) =>
      <Marker
        key={index}
        //TODO: render markers based on beer api
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
