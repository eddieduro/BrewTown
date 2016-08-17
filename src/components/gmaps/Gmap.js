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
    // this.onMapCreated = this.onMapCreated.bind(this);
    this.renderInfoWindows = this.renderInfoWindows.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.getMarkers = this.getMarkers.bind(this);
    this.toggleInfoWindow = this.toggleInfoWindow.bind(this);
  }



  getMarkers() {
    //if user has entered search text create api query string here
    let url = '';
    if(this.props.searchText !== '') {
      console.log('works, gmaps-component');
      url += this.props.updateUrl(this.props.searchText);
    } else {
      console.log('works, 2nd');
      url += beerUrl + 'search/geo/point?lat=' + this.props.initCoords.lat + '&lng=' + this.props.initCoords.lng + '&radius=1&key=e5f681af5e5cf5cd6f107ead526ba98d&';
    }

    // console.log(url);
    let coordArr = this.state.markerCoords;

    // if(this.props.searchText) {
    //   console.log('works, gmaps-component');
    //   url += beerUrl + 'search?q=' + this.props.searchText + '&radius=1&key=e5f681af5e5cf5cd6f107ead526ba98d&';
    // } else {
    // //else build api query string here
    //   url += beerUrl + 'search/geo/point?lat=' + this.state.initCoords.lat + '&lng=' + this.state.initCoords.lng + '&radius=1&key=e5f681af5e5cf5cd6f107ead526ba98d&';
    // }

    fetch(url).then(function(response) {
      return response.json();
    }).then(function(data) {
      return data.data;
    }).then(function(items) {

      this.setState({
        markerCoords: items,
        markersReceived: true
      });

    }.bind(this)).catch(function() {
      console.log("Error");
    });
  }

  renderMarkers() {
    if(!this.state.markersReceived || this.state.markerCoords == null){
      this.getMarkers();
    }
    if(this.state.markerCoords != null) {
      return this.state.markerCoords.forEach(function(coords, index) {
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
    return this.state.markerCoords.map((coords, index) => {
      //for each index of coord objects return an infowindow
      if (!infoWindows[index]) return null;
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

  // handleChange(){
  //   this.props
  // }
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

    return (
      <div>
        <Gmaps
          height={600}
          lat={this.props.initCoords.lat}
          lng={this.props.initCoords.lng}
          zoom={15}
          loadingMessage={'Finding beers near you'}
          params={{v: '3.exp', key: 'AIzaSyBJkpYAu46PQfND0jbbgYb40loKjJYetf8'}}
          onMapCreated={this.props.onMapCreated}>
          {/*{this.renderMarkers()}*/}
          {markers}
          {infoWindow}
        </Gmaps>

      </div>
    );
  }
}

export default Gmap;
