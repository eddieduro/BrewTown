import React from 'react';


class SearchContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    // console.log(props, context);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
  this.props.onUserInput(
    this.refs.searchTextInput.value,
  );
  console.log(this.props);
 }

  render() {

    return(
      <div className='container-fluid'>
        <div className='search'>
          <form>
            <label>Search</label>
            <input
              type='text'
              placeholder='search by type, name, origin...'
              value={this.props.searchText}
              ref="searchTextInput"
              onChange={this.handleChange}>
              </input>
          </form>
        </div>
      </div>
    );
  }
}

export default SearchContainer;
