import React from 'react';
import {Gmaps, Marker, InfoWindow} from 'react-gmaps';

const beerUrl = 'http://api.brewerydb.com/v2/';
const markerCoord = [{lat: 45.5303732, lng: -122.68402529999999}, {lat: 45.5303993, lng: -122.68612550000000}];

class Gmap extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      initCoords: {lat: null,
                   lng: null
                  },
      markerCoords: [{}],
      infoWindows: [false],
      mapCreated: false
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
        let initCoords = this.state.initCoords;
        //set browser coords to state
        initCoords.lat = position.coords.latitude;
        initCoords.lng = position.coords.longitude;
        // assign state to coords
        this.setState({ initCoords: initCoords});
        this.setState({ mapCreated: true});
      }
      // TODO: set default starting coords if geolocation not available
    );
  }

  renderInfoWindows() {
    //render infoWindows as false
    const {infoWindows} = this.state;

    return markerCoord.map((coords, index) => {
      //for each index of coord objects return an infowindow
      if (!infoWindows[index]) return null;
      return (
        <InfoWindow
          key={index}
          //TODO: render infowindow based on beer api
          lat={coords.lat}
          lng={coords.lng}
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
    // let url = beerUrl + 'search/geo/point?lat=' + this.state.initCoords.lat + '&lng=' + this.state.initCoords.lng + '&radius=1&key=2c5c88c1b04d408ae2be36507429f298&';

    // let markerArr = [{lat: 45.5303732, lng: 122.68402529999999}, {lat: 46.5303732, lng: 122.79802529999999}];
    // fetch(url).then(function(response) {
    //   return response.json();
    // }).then(function(data) {
    //   let breweries = data.data;
    //   breweries.map(function(brewery, index) {
    //     let marker = {lat: null, lng: null};
    //     marker.lat = brewery.latitude;
    //     marker.lng = brewery.longitude;
    //     markerArr.push(marker);
    //   });
    //   console.log(markerArr);
    // }).catch(function() {
    //   console.log("Error");
    // });

    //for each index of coord objects return a marker
    return markerCoord.map((coords, index) =>
      <Marker
      key={index}
      //TODO: render markers based on beer api
      lat={coords.lat}
      lng={coords.lng}
      onClick={() => this.toggleInfoWindow(index)}
      />
    );
  }

  render() {
    return (
      <div>
        <Gmaps
          height={600}
          lat={this.state.initCoords.lat}
          lng={this.state.initCoords.lng}
          zoom={15}
          loadingMessage={'Finding beers near you'}
          params={{v: '3.exp', key: 'AIzaSyBJkpYAu46PQfND0jbbgYb40loKjJYetf8'}}
          onMapCreated={this.onMapCreated}>
          {this.renderMarkers()}
          {this.renderInfoWindows()}
        </Gmaps>

      </div>
    );
  }
}

export default Gmap;
