import React from 'react';
import {Gmaps, Marker, InfoWindow} from 'react-gmaps';

const beerUrl = 'http://api.brewerydb.com/v2/';
// const markerCoord = [];


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
      markersReceived: false,
      search: '',
      url: '',
      updateMarkers: false
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
    if(this.props.searchText !== '' && this.props.submitSearch) {
      console.log('works, gmaps-component 2', this.props.newUrl);
      if (this.props.newUrl !== '') {
        console.log('new url works');
        url += this.props.newUrl;
        this.setState({ url: url });
      }
      this.setState({ search: this.props.searchText});
    } else {
      console.log('works, 2nd');
      url += beerUrl + 'search/geo/point?lat=' + this.props.initCoords.lat + '&lng=' + this.props.initCoords.lng + '&radius=1&key=2c5c88c1b04d408ae2be36507429f298&';
    }

    if(this.state.url) {
      console.log('new fetch')
      fetch(this.state.url).then(function(response) {
        return response.json();
      }).then(function(data) {
        return data.data;
      }).then(function(items) {

        this.setState({
          markerCoords: items,
          markersReceived: true
        });
        console.log(items);
      }.bind(this)).catch(function() {
        console.log("Error 1");
      });
    } else {
      fetch(url).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        return data.data;
      }).then(function(items) {

        this.setState({
          markerCoords: items,
          markersReceived: true
        });
        console.log(items);
      }.bind(this)).catch(function() {
        console.log("Error 2");
      });
    }
  }


  renderMarkers(searchText) {
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
    const {infoWindows} = this.state;
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
    let searchText = this.props.submitSearchText;
    // console.log(searchText, this.state.search, 'componentWillUpdate');
    if(searchText !== '' && searchText !== this.state.search){
      console.log('componentWillUpdate');
      this.handleUpdateMap();
    } else {
      this.renderMarkers();
    }
  }

  handleUpdateMap(){
    console.log(this.props.submitSearchText, 'searchtext handleupdate');
    this.setState({ search: this.props.submitSearchText});
    // console.log(this.state.search);
    if(this.props.mapCreated && this.props.submitSearchText !== ''){
      console.log('handleUpdateMap', this.props.submitSearchText);
      this.props.onUpdateMap();
      this.props.updateUrl(this.props.searchText);

      this.setState({updateMarkers: true});
    }
  }

  componentDidUpdate(){
    if( this.state.updateMarkers ) {
      console.log('componentDidUpdate');
      this.getMarkers();
      this.setState({ updateMarkers: false});
    }
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
