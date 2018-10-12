import React, { Component } from "react";
import { mflquery } from "../workers/worker.js";

class MFLFilters extends Component {
    constructor(props) {
        super(props);
        var counties = JSON.parse(localStorage.getItem("mfl_counties"));
        var sub_counties = JSON.parse(localStorage.getItem("mfl_subcounties"));
        var wards = JSON.parse(localStorage.getItem("mfl_wards"));
        var services = JSON.parse(localStorage.getItem("mfl_services"));
        var owners = JSON.parse(localStorage.getItem("mfl_owners"));
        var owners_types = JSON.parse(localStorage.getItem("mfl_ownertypes"));
        this.state = {
            counties: counties,
            sub_counties: sub_counties,
            wards: wards,
            services: services,
            owners: owners,
            owners_types: owners_types,
            query: ""
        };
        this.runQuery = this.runQuery.bind(this);
        this.countySelected = this.countySelected.bind(this);
        this.subCountySelected = this.subCountySelected.bind(this);
    }
    countySelected() {
        var county = document.getElementById("county").value;
        mflquery("common/sub_counties/?format=json&county=" + county).then(
            resp => {
                this.setState({ sub_counties: resp.results });
            }
        );
    }
    subCountySelected() {
        var sub_counties = document.getElementById("sub_county").value;
        mflquery("common/wards/?format=json&sub_county=" + sub_counties).then(
            resp => {
                this.setState({ wards: resp.results });
            }
        );
    }
    runQuery() {
        var query = "";
        var county = document.getElementById("county").value;
        var subcounty = document.getElementById("sub_county").value;
        var ward = document.getElementById("ward").value;
        /* var service = document.getElementById("service").value;
        var hasbeds = document.getElementById("has_beds").checked;
        var hascots = document.getElementById("has_cots").checked;
        var no_beds = document.getElementById("no_beds").value;
        var no_cots = document.getElementById("no_cots").value;
        var keph = document.getElementById("keph_level").value;
        var owner = document.getElementById("owner").value;
        var owner_type = document.getElementById("owner_type").value;
        var operational = document.getElementById("operational").checked; */

        query = county !== "-1" ? "county=" + county : "";
        query += subcounty === "-1" ? "" : "&sub_county=" + subcounty;
        query += ward !== "-1" ? "&ward=" + ward : "";
        /*  query += service !== "-1" ? "&service=" + service : "";
         console.log(query);
         query += keph !== "-1" ? "&keph_level=" + keph : "";
         console.log(query);
         query += owner !== "-1" ? "&owner=" + owner : "";
         console.log(query);
 
         query += owner_type !== "-1" ? "&owner_type=" + owner_type : "";
         console.log(query);
         query += operational ? "&operational=true" : "";
         console.log(query);
         query += hasbeds ? "&has_beds=true" : "";
         console.log(query);
         query += hascots ? "&has_cots=true" : "";
         console.log(query);
         query += no_beds ? "&no_beds=" + no_beds : "";
         console.log(query);
         query += no_cots ? "&no_cots=" + no_cots : "";
  */
        console.log(query);

        this.props.runQuery(query);
    }
    render() {
        let dtent = "collapse " + this.props.cname;
        return (
            <div
                id="filters_options"
                style={{ backgroundColor: "#F8F8F8" }}
                className={dtent}
            >
                <div className="card-header h1 align-content-cente" style={{ color: "#276696" }}>MFLFilters</div>
                <div className="card card-body" style={{ backgroundColor: "#F8F8F8" }}>
                    <div className="row">
                        <div className="col">
                            <div className="filter_option ">
                                <select
                                    id="county"
                                    className="form-control form-control-sm custom-select"
                                    onChange={this.countySelected.bind(this)}
                                >
                                    <option value={-1}>select county</option>
                                    {this.state.counties.map(county => (
                                        <option
                                            value={county.id}
                                            key={county.id}
                                            className="form-control form-control-sm"
                                        >
                                            {county.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col">
                            <div className="filter_option">
                                <select
                                    id="sub_county"
                                    className="form-control form-control-sm custom-select"
                                    onChange={this.subCountySelected.bind(this)}
                                >
                                    <option value={-1}>select sub county</option>
                                    {this.state.sub_counties.map(sub_county => (
                                        <option key={sub_county.id} value={sub_county.id}>{sub_county.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col">
                            <div className="filter_option">
                                <select
                                    id="ward"
                                    className="form-control form-control-sm custom-select"
                                >
                                    <option value={-1}>select ward</option>
                                    {this.state.wards.map(ward => (
                                        <option key={ward.id} value={ward.id}>{ward.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/*   <div className="col">
                            <div className="filter_option">
                                <select
                                    id="service"
                                    className="form-control form-control-sm custom-select "
                                >
                                    <option value={-1}>choose service</option>
                                    {this.state.services.map(service => (
                                        <option key={service.id} value={service.id}>{service.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col">
                            <div className="filter_option">
                                <div className="input-group-text">
                                    <input
                                        type="checkbox"
                                        aria-label="Checkbox for following text input"
                                        id="has_beds"
                                    />
                                    Has Beds
                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="filter_option">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="No of beds"
                                    id="no_beds"
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="filter_option">
                                <div className="input-group-text">
                                    <input
                                        type="checkbox"
                                        aria-label="Checkbox for following text input"
                                        placeholder="has cots"
                                        id="has_cots"
                                    />
                                    Has Cots
                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="filter_option">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="No. of Cots"
                                    id="no_cots"
                                />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col">
                            <select className="form-control form-control-sm" id="keph_level">
                                <option value={-1}>KEMPH Level</option>
                                <option value="1">Level 1</option>
                                <option value="2">Level 2</option>
                                <option value="3">Level 3</option>
                                <option value="4">Level 4</option>
                                <option value="5">Level 5</option>
                                <option value="6">Level 6</option>
                            </select>
                        </div>
                        <div className="col">
                            <div className="filter_option">
                                <select id="owner" className="form-control form-control-sm">
                                    <option value={-1}>select owner</option>
                                    {this.state.owners.map(owner => (
                                        <option
                                            key={owner.id}
                                            value={owner.id}
                                            className="form-control form-control-sm"
                                        >
                                            {owner.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col">
                            <div className="filter_option">
                                <select
                                    id="owner_type"
                                    className="form-control form-control-sm"
                                >
                                    <option value={-1}>select owner type</option>
                                    {this.state.owners_types.map(owner_type => (
                                        <option
                                            key={owner_type.id}
                                            value={owner_type.id}
                                            className="form-control form-control-sm"
                                        >
                                            {owner_type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col">
                            <div className="filter_option">
                                <div className="input-group-text">
                                    <input
                                        type="checkbox"
                                        aria-label="Checkbox for following text input"
                                        id="operational"
                                    />
                                    Operational?
                </div>
                            </div>
                        </div>
                    </div>
                 */}
                    </div>
                </div>
                <button
                    onClick={this.runQuery.bind(this)}
                    className="btn btn-primary"
                    data-target="#filters_options"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                    style={{ marginLeft: "50%" }}
                >
                    SEARCH KMHFL
        </button>
            </div>
        );
    }
}

export default MFLFilters;
