import React from 'react';
import {Link} from 'react-router';
import Gmap from '../gmaps/Gmap';
import SearchContainer from '../search/SearchContainer';

// const beerUrl = 'http://api.brewerydb.com/v2/';
const beerUrl = 'https://api.yelp.com/v2/';

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
      submitSearchText: '',
      clientToken: ''
    };
    this.onMapCreated = this.onMapCreated.bind(this);
    this.onUpdateMap = this.onUpdateMap.bind(this);
    this.updateUrl = this.updateUrl.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(){
    let yelpUrl = 'https://api.yelp.com/oauth2/token';

    let obj = {
      method: "POST",
      headers: {
       'Accept': 'application/x-www-form-urlencoded',
       'Content-type': 'application/x-www-form-urlencoded'
      },
      body:
        'grant_type=client_credentials&client_id=TDWAt2VKQsLvdCtBz4-hQQ&client_secret=pxjafQhHbG9JzG9hms2cugVpcc5sxffTx01P61KiBjREllmJxFwMomxqXu857ZaG'
    }
    fetch(yelpUrl, obj).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data, 'yelp response');
      return data.access_token;
    }).then(function(token) {
      if(this.state.clientToken === '') {
        this.setState({ clientToken: token });
      }
    }.bind(this)).catch(function() {
      console.log("Error 1");
    });
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
  // search/?location=92026&sort=1&category_filter=breweries
  updateUrl(searchText) {
    let newUrl = beerUrl + 'search/?location=' + searchText + 'sort=1&category_filter=breweries&oauth_consumer_key=wGZB-55TSAHeTqqLLTugww&oauth_token=emfbijnN_YscAimIvyNZL1Ix4RIMyHBS&oauth_signature_method=hmac-sha1&oauth_signature=SElWUZcrPrXhhnvRpsZfmL-K3b4&oauth_timestamp';
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
    this.fetchData();
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
