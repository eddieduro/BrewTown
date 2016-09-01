import React from 'react';
import {Link, IndexLink} from 'react-router';

const Footer = () => {
  return (
    <footer>
      <div>
        <p>Copyright BrewTown, made with <span className='red'>love</span> by Eddie Duro</p>
        <IndexLink to='/' activeClassName='active'>Home</IndexLink>
        {" | "}
        <Link to='/about' activeClassName='active'>About</Link>
      </div>
    </footer>
  );
}

export default Footer;
