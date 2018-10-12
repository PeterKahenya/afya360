import React, { Component } from "react";
import ResultsPage from "./components/ResultsPage";
import { dhis2query, mflquery } from "./workers/worker";
import HomePage from "./components/HomePage";


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      system: "",
      in_homepage: true,
      status: -1
    }
    this.comp = <ResultsPage searchTerm={this.searchTerm.bind(this)} term={this.state.system} results={this.state.results} />
    this.searchTerm = this.searchTerm.bind(this)
  }

  runQuery(query, system) {
    this.setState({ in_homepage: false, results: [], status: 0 })
    if (system === "KMHFL") {
      mflquery("facilities/facilities/?format=json&page_size=10&" + query).then(mfl_res => {
        this.setState({
          system: system,
          results: mfl_res.results,
          status: 1
        })
      })
    } else {
      dhis2query("organisationUnits.json?filter=level:eq:5&" + query).then(resp => {
        var temp = []
        resp.organisationUnits.map(org => {
          dhis2query("organisationUnits/" + org.id + ".json").then(org_unit => {
            temp.push(org_unit)
            this.setState({ system: system, results: temp, status: 1 });
          })

        })
      })
    }
  }
  searchTerm(term, system) {
    this.setState({ in_homepage: false, results: [], status: 0 });
    if (system === "KMHFL") {
      mflquery("facilities/facilities/?format=json&page_size=10&search=" + term).then(mfl_res => {
        this.setState({
          system: system,
          results: mfl_res.results,
          status: 1
        })

      })
    } else {
      dhis2query(
        "organisationUnits.json?filter=level:eq:5&filter=displayName:ilike:" + term).then(resp => {
          var temp = []
          resp.organisationUnits.map((org, index) => {
            dhis2query("organisationUnits/" + org.id + ".json").then(org_unit => {
              temp.push(org_unit)
              if (index + 1 === resp.organisationUnits.length) {
                this.setState({ system: system, results: temp, status: 1 });
              }
            })
          })

        });
    }
  }


  render() {
    return this.state.in_homepage ?
      <HomePage runQuery={this.runQuery.bind(this)} searchTerm={this.searchTerm.bind(this)} system={this.state.system} />
      : <ResultsPage runQuery={this.runQuery.bind(this)} searchTerm={this.searchTerm.bind(this)} system={this.state.system}
        results={this.state.results} status={this.state.status} />

  }
}

export default App;
