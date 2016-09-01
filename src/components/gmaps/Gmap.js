import React from 'react';
import {Gmaps, Marker, InfoWindow} from 'react-gmaps';

const beerUrl = 'https://api.brewerydb.com/v2/';
const yelpUrl = 'https://api.yelp.com/v2/';
const beerIcon = 'https://static.dpaw.wa.gov.au/static/libs/ionicons/1.3.2/src/beer.svg';

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
      updateMarkers: false,
      receivedToken: false,
      token: ''
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
      console.log('works, gmaps-component 2');
      if (this.props.newUrl !== '') {
        console.log('new url works', this.props.newUrl, 'clientToken', this.props.clientToken);
        url += this.props.newUrl;
        this.setState({ url: url });
      }
      console.log(this.state.token, 'STATE TOKEN');
      let obj = {
        method: "POST",
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer' + this.props.clientToken
        }
      };
      // ;
      this.setState({ search: this.props.searchText});
      console.log(obj);
    } else {
      console.log('works, 2nd');
      url += beerUrl + 'search/geo/point?lat=' + this.props.initCoords.lat + '&lng=' + this.props.initCoords.lng + '&radius=1&key=e5f681af5e5cf5cd6f107ead526ba98d&';
    }

    console.log(this.props.clientToken, 'clientToken');
    if(this.props.clientToken !== '' && this.state.receivedToken === false ) {
      console.log('new fetch')
      fetch(this.state.url, obj).then(function(response) {
        return response.json();
      }).then(function(data) {
        return data.data;
      }).then(function(items) {

        this.setState({
          markerCoords: items,
          markersReceived: true,
          receivedToken: true
        });
        console.log(items);
      }.bind(this)).catch(function() {
        console.log("Error 1");
      });
    } else {
      fetch(url).then(function(response) {
        console.log('2nd fetch url');
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
    // this.refs.Gmaps.refs.Marker.getEntity().setIcon(beerIcon);
    if(!this.state.markersReceived || this.state.markerCoords == null){
      this.getMarkers();
    }
    if(this.state.markerCoords !== null) {
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


  componentWillReceiveProps() {

    let searchText = this.props.submitSearchText;
    // console.log(searchText, this.state.search, 'componentWillUpdate');
    if(searchText !== '' && searchText !== this.state.search && this.props.submitSearchText && this.state.receivedToken !== true){
      console.log('componentWillUpdate updatemap');
      this.handleUpdateMap();
    } else {
      this.renderMarkers();
    }
    if(this.props.clientToken !== '') {
      console.log(this.props.clientToken, 'componentWillReceiveProps');
      this.setState({ token: this.props.clientToken});
      console.log(this.state.token, 'state token');
    }
  }

  handleUpdateMap(){
    console.log(this.props.submitSearchText, 'searchtext handleupdate');
    this.setState({ search: this.props.submitSearchText});
    // console.log(this.state.search);
    if(this.props.mapCreated && this.props.submitSearchText !== '' && this.props.searchText && this.state.receivedToken !== true){
      console.log('handleUpdateMap', this.props.submitSearchText);
      this.props.onUpdateMap();
      this.props.updateUrl(this.props.searchText);

      this.setState({updateMarkers: true});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props.clientToken, 'token');
    // console.log(this.state.url, 'component state', nextState.url);
    if(this.props.newUrl !== '') {
      this.setState({
        url: this.props.newUrl,
        token: this.props.clientToken
      });
      this.renderMarkers();
      console.log(this.props.clientToken, 'shouldComponentUpdate token');
    }

    if(this.state.updateMarkers && this.state.receivedToken !== true ) {
      console.log('componentDidUpdate gmaps');
      console.log(this.props.newUrl, 'componentDidUpdate new url', this.props.yelpUrl, 'yelp url', this.props.url, 'url');
      this.getMarkers();
      this.setState({ updateMarkers: false});
    }
    return true;
  }

  // componentDidUpdate(prevProps, prevState){
  //   // console.log('prevProp', prevProps, this.props, 'prevState', prevState, this.state);
  //   console.log(this.state.url, 'componentDidUpdate', this.state.receivedToken, this.state.updateMarkers);
  //   if(this.state.updateMarkers && this.state.receivedToken !== true ) {
  //     console.log('componentDidUpdate gmaps');
  //     console.log(this.props.newUrl, 'componentDidUpdate new url', this.props.yelpUrl, 'yelp url', this.props.url, 'url');
  //     this.getMarkers();
  //     this.setState({ updateMarkers: false});
  //   }
  // }
  render() {

    const {infoWindows} = this.state;
    const markers = this.state.markerCoords.map((coords, index) => {
            return <Marker
                ref="Marker"
                key={index}
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
          ref="Gmaps"
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
