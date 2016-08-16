import React from 'react';
import {Link} from 'react-router';
import Gmap from '../gmaps/Gmap';
import SearchContainer from '../search/SearchContainer';

const beerUrl = 'http://api.brewerydb.com/v2/';

class HomePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchText: '',
      initCoords: {lat: null,
                   lng: null
                  },
      markerCoords: [{lat: null, lng: null}],
      mapCreated: false,
      markersReceived: false,
      url: ''
    };
    this.onMapCreated = this.onMapCreated.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.getUrl  = this.getUrl.bind(this);
  }

  onMapCreated(map) {
    //get current position based off of browser geolocation
    if(this.state.searchText !== '') {
      console.log('here');
      let initCoords = this.state.initCoords;

      initCoords.lat = this.state.markerCoords[0].lat;
      initCoords.lng = this.state.markerCoords[0].lng;

      this.setState({ initCoords: initCoords });
      this.setState({ mapCreated: true});
    } else {
      console.log('here 2');
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

  }

  handleUserInput(searchText) {
    this.setState({
      searchText: searchText
    });
    // console.log(this.state.searchText);
  }

  getUrl(searchText) {
    let newUrl = '';

    if(this.state.searchText !== '') {
      console.log('works, gmaps-component');
      newUrl += beerUrl + 'search?q=' + searchText + '&radius=1&key=e5f681af5e5cf5cd6f107ead526ba98d&';
      this.setState({ url: newUrl });
      return null;
    } else {
      //else build api query string here
      newUrl += beerUrl + 'search/geo/point?lat=' + this.state.initCoords.lat + '&lng=' + this.state.initCoords.lng + '&radius=1&key=e5f681af5e5cf5cd6f107ead526ba98d&';
      this.setState({ url: newUrl });
      return null;
    }
  }
  // componentWillmount(){
  //
  // }

  render() {
    // if(!this.state.mapCreated) {
    //   this.getUrl();
    // }
    return(
      <div className="main">
        <div className='container-fluid'>
          <SearchContainer
            searchText={this.state.searchText}
            onUserInput={this.handleUserInput}/>
        </div>

        <div className="jumbotron">
          <h1> BrewTown </h1>
          <p> Find your favorite beers and where they are being poured! </p>
          <Link to="about" className="btn btn-primary btn-lg"> Learn More </Link>
        </div>

        <div className='map-container'>
          <div id='map'>
            <Gmap
              searchText={this.state.searchText}
              initCoords={this.state.initCoords}
              onMapCreated={this.onMapCreated}
              updateUrl={this.getUrl}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
