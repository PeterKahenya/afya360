import React, { Component } from 'react';
import "./css/searchbar.css"
import DHIS2Filters from "./DHIS2Filters"
import MFLFilters from "./MFLFilters"
import { mflquery, dhis2query } from "../workers/worker.js"
class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            system: "KMHFL",
            query: ""
        }
        localStorage.setItem("app_system", "KMHFL")
    }
    changeSystem(e) {
        this.setState({ system: e.target.value })
        localStorage.setItem("app_system", JSON.stringify(e.target.value))
    }
    searchTerm(e) {
        this.props.searchTerm(document.getElementById("query").value, this.state.system)
    }

    runQuery(query) {
        this.props.runQuery(query, this.state.system)
    }
    render() {
        return (
            <div className={this.props.cname}>
                <div className="system_choice">
                    <input type="radio" value="KMHFL" id="kmhf-radio" className="form-radio" onChange={this.changeSystem.bind(this)} defaultChecked name="system" />
                    <label className="h2 text-secondary">KMHFL</label>
                    <input type="radio" value="DHIS2" className="form-radio" onChange={this.changeSystem.bind(this)} name="system" />
                    <label className="h2 text-secondary">DHIS2</label>
                </div>
                <div className="input-group shadow-sm input-group-lg"
                    style={{
                        height: "50px",
                        border: "none",
                        backgroundColor: "#F8F8F8",
                        borderRadius: "30px"
                    }}
                    id="suggestions">
                    <div className="input-group-prepend">
                        <span
                            className="input-group-text btn btn-primary filtersbtn "
                            id="inputGroup-sizing-lg"
                            data-toggle="collapse"
                            data-target="#filters_options"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                            style={{
                                backgroundColor: "#F8F8F8",
                                height: "50px",
                                cursor: "pointer",
                                borderRadius: "30px",
                                border: "0"
                            }}
                        ><i className="material-icons" style={{ color: "rgb(1, 126, 199)" }}>
                                filter_list
                                </i>

                        </span>

                    </div>
                    <input type="text" className="form-control" aria-label="Sizing example input" style={{
                        height: "100%",
                        backgroundColor: "#F8F8F8",
                        fontSize: "1.5em",
                        border: "0"
                    }} onChange={this.valueChanged.bind(this)}
                        id="query"
                        placeholder="Search Facility Name, MFL code or Location..."
                        aria-label="Search Facility Name, MFL code or Location..."
                        aria-describedby="button-addon4" />
                    <div className="input-group-prepend">
                        <button className="btn input-group-text" id="inputGroup-sizing-lg"
                            onClick={this.searchTerm.bind(this)} style={{
                                height: "50px",
                                width: "100px",
                                borderRadius: "30px",
                                padding: "30px",
                                paddingTop: "0",
                                paddingBottom: "0",
                                float: "right",
                                border: "none",
                                backgroundColor: "transparent"



                            }}
                            id="smartbtn">
                            <i className="material-icons" style={{ color: "#276696", width: "50px" }}>
                                search
                            </i>
                        </button>
                    </div>
                </div>


                {this.state.system === "KMHFL" ? <MFLFilters runQuery={this.runQuery.bind(this)} /> : <DHIS2Filters runQuery={this.runQuery.bind(this)} />}
            </div>);
    }
    valueChanged(e) {
        var valuesofar = e.target.value;
        var mflcodes = JSON.parse(localStorage.getItem("mfl_codes")).map(code => {
            return code.code;
        });



    }
    componentDidMount() {
        var inp = document.getElementById("query");
        var currentFocus;
        inp.addEventListener("input", function (e) {
            var a,
                b,
                i,
                val = this.value;
            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            document.getElementById("suggestions").appendChild(a);
            if (document.getElementById("kmhf-radio").checked) {
                mflquery("facilities/facilities/?format=json&page_size=5&search=" + val).then(res => {
                    res.results.map(facility => {
                        b = document.createElement("DIV");
                        b.innerHTML =
                            "<strong>" + facility.name.substr(0, val.length) + "</strong>";
                        b.innerHTML += facility.name.substr(val.length);
                        b.innerHTML += "<input type='hidden' value='" + facility.name + "'>";
                        b.addEventListener("click", function (e) {
                            inp.value = this.getElementsByTagName("input")[0].value;
                            document.getElementById("smartbtn").style =
                                "display:block;height:50px;border-radius:30px";
                            document.getElementById("smartbtn").className =
                                "btn btn-outline-primary";
                            closeAllLists();
                        });
                        a.appendChild(b);
                    });
                });
            } else {
                dhis2query("organisationUnits.json?filter=displayName:ilike:" + val).then(res => {
                    res.organisationUnits.map(facility => {
                        b = document.createElement("DIV");
                        b.innerHTML =
                            "<strong>" + facility.displayName.substr(0, val.length) + "</strong>";
                        b.innerHTML += facility.displayName.substr(val.length);
                        b.innerHTML += "<input type='hidden' value='" + facility.displayName + "'>";
                        b.addEventListener("click", function (e) {
                            inp.value = this.getElementsByTagName("input")[0].value;
                            document.getElementById("smartbtn").style =
                                "display:block;height:50px;border-radius:30px";
                            document.getElementById("smartbtn").className =
                                "btn btn-outline-primary";
                            closeAllLists();
                        });
                        a.appendChild(b);
                    });
                });
            }
        });
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = x.length - 1;
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }
}

export default SearchBar;