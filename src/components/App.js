import React, {PropTypes} from 'react';
import Header from './common/Header';
import Gmap from './gmaps/Gmap';

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <Header/>
        {this.props.children}
        <div className='map-container'>
          <div id='map'>
            <Gmap/>
          </div>
        </div>
        <div className='sidebar'></div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
