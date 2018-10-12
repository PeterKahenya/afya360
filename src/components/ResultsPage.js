import React, { Component } from "react";
import NavBar from "./NavBar"
import SearchResults from "./SearchResults";
import Resolutions from "./Resolutions";

class ResultsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { results: [], system: "", status: 0 };
  }

  searchTerm(term, system) {
    this.props.searchTerm(term, system)
  }
  componentWillReceiveProps(props) {
    this.setState({
      results: props.results, system: props.system, status: props.status
    })
  }

  runQuery(query, system) {
    this.props.runQuery(query, system)
  }
  render() {
    return (
      <div className="results">

        <NavBar runQuery={this.runQuery.bind(this)} searchTerm={this.searchTerm.bind(this)} />
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <SearchResults results={this.state.results} system={this.state.system} status={this.state.status} />
          </div>
          <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <Resolutions results={this.state.results} system={this.state.system} status={this.state.status} /></div>
        </div>

      </div>);
  }
}

export default ResultsPage;
