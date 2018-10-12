import React, { Component } from 'react';
import Facility from './Facility';
import DHIS2Facility from './DHIS2Facility';

class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: props.results,
            system: props.system,
            status: 0
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            results: props.results,
            system: props.system,
            status: props.status
        })
    }
    render() {
        console.log(this.state.system)
        var id = 0;
        return (<div style={{ paddingLeft: "177px" }}>
            {this.state.status === 1 ? "found " + this.state.results.length + " results" : this.state.status === 0 ? "searching " + localStorage.getItem("app_system") + "..." : ""}
            {this.state.results.map(facility => {
                id = id + 1
                return this.state.system === "KMHFL" ? <Facility facility={facility} key={id} id={id} /> : <DHIS2Facility facility={facility} key={id} />
            })}
        </div>);
    }
}

export default SearchResults;