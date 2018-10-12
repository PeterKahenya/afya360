import React, { Component } from "react";
import SearchBar from "./SearchBar";
import logo from "./medical.png"
import "./css/homepage.css"
import Title from "./Title";
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = { term: "", system: "" };
    this.searchNow = this.searchNow.bind(this);
  }
  searchNow(term, system) {
    this.props.searchTerm(term, system)
  }

  runQuery(query, system) {
    this.props.runQuery(query, system)
  }

  render() {
    return (

      <div className="homepage">
        <div className="faze" />
        <div className="holder">
          <div>
            <img src={logo} className="logo" alt="afya360logo" />
          </div>
          <Title cname="home_title" />
          <br />
          <SearchBar cname={"home_searchbar"} searchTerm={this.searchNow.bind(this)} runQuery={this.runQuery.bind(this)} />
        </div>
      </div>



    );
  }
}

export default HomePage;
