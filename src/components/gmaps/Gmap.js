import React from 'react';
import {Gmaps, Marker, InfoWindow} from 'react-gmaps';

const beerUrl = 'http://api.brewerydb.com/v2/';
const markerCoord = [];


class Gmap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      initCoords: {lat: null,
                   lng: null
                  },
      markerCoords: [{lat: null, lng: null}],
      infoWindows: [false],
      mapCreated: false,
      markersReceived: false
    };
    this.onMapCreated = this.onMapCreated.bind(this);
    this.renderInfoWindows = this.renderInfoWindows.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.getMarkers = this.getMarkers.bind(this);
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

  getMarkers() {
    //if user has entered search text create api query string here
    let url = '';
    let coordArr = this.state.markerCoords;
    // let markerArr = [];

    if(this.props.searchText) {
      console.log('works, gmaps-component');
      url += beerUrl + 'search?q=' + this.props.searchText + '&radius=1&key=e5f681af5e5cf5cd6f107ead526ba98d&';
    } else {
    //else build api query string here
      url += beerUrl + 'search/geo/point?lat=' + this.state.initCoords.lat + '&lng=' + this.state.initCoords.lng + '&radius=1&key=e5f681af5e5cf5cd6f107ead526ba98d&';
    }
      // if(coordArr != null && this.state.mapCreated ) {

    fetch(url).then(function(response) {
      return response.json();
    }).then(function(data) {
      return data.data;
    }).then(function(items) {
      // console.log(items);
      // coordArr.concat([items]);
      // console.log(coordArr);
      this.setState({
        markerCoords: items,
        markersReceived: true
      });

    }.bind(this)).catch(function() {
      console.log("Error");
    });
    // console.log(this.state.markerCoords);
  }

  renderMarkers() {
    if(!this.state.markersReceived || this.state.markerCoords == null){
      this.getMarkers();
    }
    if(this.state.markerCoords != null) {
      console.log(this.state.markerCoords, 'works');
      return this.state.markerCoords.forEach(function(coords, index) {
        console.log(coords, 'coords');
        return <Marker
                 key={index}
                 lat={coords.latitude}
                 lng={coords.longitude}
                 onClick={() => this.toggleInfoWindow(index)}
               />
      });
    }
  }

  renderInfoWindows() {
    //render infoWindows as false


    return this.state.markerCoords.map((coords, index) => {
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

  componentWillUpdate() {
    this.renderMarkers();
  }

  render() {
    const {infoWindows} = this.state;
    const markers = this.state.markerCoords.map((coords, index) => {
            return <Marker key={index}
                lat={coords.latitude}
                lng={coords.longitude}
                onClick={() => this.toggleInfoWindow(index)} />;
        });
    const infoWindow = this.state.markerCoords.map((coords, index) => {
      let breweryName = coords.name;
      let breweryAddress = coords.streetAddress;
      let breweryPhone = coords.phone;
      //TODO: message for when phone or address is not listed
      if(coords.brewery) {
        breweryName = coords.brewery.name;
        // console.log('yee');
      }


      let breweryInfo = breweryName + ' ' + breweryAddress + ' ' + breweryPhone;
      //for each index of coord objects return an infowindow
      // if infoWindow is available return null so window starts off closed.
      if (!infoWindows[index]) return null;
      return <InfoWindow
          key={index}
          //TODO: render infowindow based on beer api
          lat={coords.latitude}
          lng={coords.longitude}
          //TODO: fill content for each window with data from beer api
          content={breweryInfo}
          onCloseClick={() => this.toggleInfoWindow(index)}
        />

    });
    // console.log(this.state.marker)
    // const markers = this.state.markerCoords.forEach((coords, index) => {
    //   // console.log(coords, 'coords');
    //   return <Marker
    //            key={index}
    //            lat={coords.latitude}
    //            lng={coords.longitude}
    //            onClick={() => this.toggleInfoWindow(index)}
    //          />
    // });
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
          {/*{this.renderMarkers()}*/}
          {markers}
          {infoWindow}
        </Gmaps>

      </div>
    );
  }
}

export default Gmap;


// breweries.map(function(brewery, index) {
//   let marker = {lat: null, lng: null};
//   marker.lat = brewery.latitude;
//   marker.lng = brewery.longitude;
//   markerCoord.push(marker);
//   return markerCoord;
// });
