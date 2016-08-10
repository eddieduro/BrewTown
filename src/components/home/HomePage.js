import React from 'react';
import {Link} from 'react-router';
import Gmap from '../gmaps/Gmap';
import SearchContainer from '../search/SearchContainer';

class HomePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchText: ''
    }
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(searchText) {
    this.setState({
      searchText: searchText
    });
  }

  render() {
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
            <Gmap searchText={this.state.searchText}/>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
