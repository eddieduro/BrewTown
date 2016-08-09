import React from 'react';
import {Link} from 'react-router';

class HomePage extends React.Component{
  render() {
    return(
      <div className="jumbotron">
        <h1> BrewTown </h1>
        <p> Find your favorite beers and where they are being poured! </p>
        <Link to="about" className="btn btn-primary btn-lg"> Learn More </Link>
      </div>
    );
  }
}

export default HomePage;
