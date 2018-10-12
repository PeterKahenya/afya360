import React, { Component } from 'react';
import SearchBar from './SearchBar';
import Title from './Title';
import "./css/NavBar.css"

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }
    goHome() {
        window.location.reload()
    }
    searchNow(term, system) {
        this.props.searchTerm(term, system)
    }
    runQuery(query, system) {
        this.props.runQuery(query, system)
    }
    render() {
        return (
            <div className="shadow-sm">
                <nav className="mynav navbar navbar-expand-lg ">
                    <label className="navbar-brand" onClick={this.goHome.bind(this)}><Title cname={"nav_title"} /></label>
                    <div className="nav-item" >
                        <SearchBar runQuery={this.runQuery.bind(this)} searchTerm={this.searchNow.bind(this)} cname={"nav_searchbar"} /><br />
                    </div>
                </nav>
                <ul className="nav nav-tabs" id="myTab" role="tablist" style={{ paddingLeft: "177px", paddingTop: "0" }}>
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