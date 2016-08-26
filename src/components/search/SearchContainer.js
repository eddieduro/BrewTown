import React from 'react';


class SearchContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    // console.log(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange() {
    this.props.onUserInput(
      this.refs.searchTextInput.value,
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    let searchText = this.props.searchText;
    // console.log(searchText, 'searchContainer');
    if(!searchText) {
      return;
    } else {
      this.props.onSearchSubmit(searchText);
    }
    //  this.props.onCommentSubmit({ searchText: searchText})
    // this.setState({ searchText: ''});
  }

  render() {

    return(
      <div className='container-fluid'>
        <div className='search'>
          <form className='searchForm' onSubmit={this.handleSubmit}>
            <label>Search</label>
            <input
              type='text'
              placeholder='search by type, name, origin...'
              value={this.props.searchText}
              ref="searchTextInput"
              onChange={this.handleChange}>
              </input>
              <input type="submit" value="Post" />
          </form>
        </div>
      </div>
    );
  }
}

export default SearchContainer;
