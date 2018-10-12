import React, { Component } from 'react';
import SearchBar from './SearchBar';
import ReactDOM from "react-dom";
import HomePage from "./HomePage";
import Title from './Title';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }
    goHome() {
        ReactDOM.render(<HomePage />, document.getElementById("root"))
    }
    searchNow(term, system) {
        this.props.searchTerm(term, system)
    }
    runQuery(query, system) {
        this.props.runQuery(query, system)
    }
    render() {
        return (
            <div className="mynav shadow">
                <nav className="navbar navbar-expand-lg ">
                    <label className="navbar-brand" onClick={this.goHome.bind(this)}><Title className="bg-primary" /></label>

                    <div className="nav-item" style={{ width: "70%" }}>
                        <SearchBar runQuery={this.runQuery.bind(this)} searchTerm={this.searchNow.bind(this)} /><br />
                    </div>
                </nav>
                <ul className="nav nav-tabs" id="myTab" role="tablist" style={{ paddingLeft: "177px" }}>
                    <li className="nav-item">
                        <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Results</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Resolutions</a>
                    </li>
                </ul>
            </div>);
    }
}

export default NavBar;