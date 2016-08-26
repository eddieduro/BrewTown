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
      url: '',
      newUrl: '',
      updatedMap: false,
      submitSearch: false,
      submitSearchText: ''
    };
    this.onMapCreated = this.onMapCreated.bind(this);
    this.onUpdateMap = this.onUpdateMap.bind(this);
    this.updateUrl = this.updateUrl.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  onMapCreated(map) {
    if(this.state.searchText !== '' && this.state.updatedMap) {
      console.log('created update map', this.state.newUrl);
      let initCoords = this.state.initCoords;
      this.setState({ updatedMap: false});
    } else {
      //get current position based off of browser geolocation
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

  updateUrl(searchText) {
    let newUrl = beerUrl + 'search?q=' + searchText + '&key=2c5c88c1b04d408ae2be36507429f298&';
    this.setState({ newUrl: newUrl});
    // console.log(newUrl);
  }

  onUpdateMap(map){
    if(this.state.searchText !== '' && this.state.mapCreated) {
      console.log('here, update');
      let initCoords = this.state.initCoords;

      initCoords.lat = this.state.markerCoords.lat;
      initCoords.lng = this.state.markerCoords.lng;
      console.log(initCoords);

      this.setState({ initCoords: initCoords });
      this.setState({ mapCreated: false});
      this.setState({ updatedMap: true});
    }
  }

  handleUserInput(searchText) {
    this.setState({
      searchText: searchText
    });

  }

  handleSearchSubmit(searchText) {
    console.log(searchText);
    this.setState({
      submitSearchText: searchText,
      submitSearch: true
    });
    // console.log(this.state.searchText);
  }

  componentDidUpdate() {
    if(this.state.updatedMap) {
      this.onMapCreated();
    }
  }
  render() {
    // if(!this.state.mapCreated) {
    //   this.getUrl();
    // }
    return(
      <div className="main">
        <div className='container-fluid'>
          <SearchContainer
            searchText={this.state.searchText}
            onUserInput={this.handleUserInput}
            onSearchSubmit={this.handleSearchSubmit}/>
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
              mapCreated={this.state.mapCreated}
              onUpdateMap={this.onUpdateMap}
              updateUrl={this.updateUrl}
              newUrl={this.state.newUrl}
              url={this.state.url}
              onSearchSubmit={this.handleSearchSubmit}
              submitSearch={this.state.submitSearch}
              submitSearchText={this.state.submitSearchText}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
