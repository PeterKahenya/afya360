import React, { Component } from "react";
import { dhis2query } from "../workers/worker"

class DHIS2Filters extends Component {
    constructor(props) {
        super(props);
        var counties = JSON.parse(
            localStorage.getItem("dhis2_county_names_and_id")
        );
        this.state = { counties: counties, subcounties: [], wards: [] };
        this.countySelected = this.countySelected.bind(this);
        this.subCountySelected = this.subCountySelected.bind(this);
    }

    countySelected(e) {
        var county = e.target.value;
        if (county !== -1) {
            dhis2query("organisationUnits.json?filter=parent.id:eq:" + county).then(resp => {
                this.setState({ subcounties: resp.organisationUnits })
            })
        }
    }
    subCountySelected(e) {
        var subcounty = e.target.value;
        if (subcounty !== -1) {
            dhis2query("organisationUnits.json?filter=parent.id:eq:" + subcounty).then(resp => {
                this.setState({ wards: resp.organisationUnits })
            })
        }
    }
    runQuery() {
        var query = "filter=ancestors.id:eq:"
        var county = document.getElementById("county").value;
        var subcounty = document.getElementById("subcounty").value;
        var ward = document.getElementById("ward").value;
        if (ward !== "-1") {
            this.props.runQuery(query + ward)
        } else {
            if (subcounty !== "-1") {
                this.props.runQuery(query + subcounty)
            } else {
                if (county !== "-1") {
                    this.props.runQuery(query + county)
                }
            }
        }
    }

    render() {
        let dtent = "collapse " + this.props.cname;
        return (
            <div id="filters_options" style={{ backgroundColor: "#f8f8f8" }} className={dtent}>
                <div className="card-header h1 align-content-cente" style={{ color: "#276696" }}>DHIS2Filters</div>
                <div className="card card-body" style={{ backgroundColor: "#f8f8f8" }}>
                    <div className=" row">
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
                                            className="form-control form-control-sm"
                                            key={county.id}
                                        >
                                            {county.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col">
                            <div className="filter_option ">
                                <select
                                    id="subcounty"
                                    className="form-control form-control-sm custom-select"
                                    onChange={this.subCountySelected.bind(this)}
                                >
                                    <option value={-1}>select subcounty</option>
                                    {this.state.subcounties.map(subcounty => (
                                        <option
                                            value={subcounty.id}
                                            className="form-control form-control-sm"
                                            key={subcounty.id}
                                        >
                                            {subcounty.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col">
                            <div className="filter_option ">
                                <select id="ward" className="form-control form-control-sm custom-select" onChange={this.countySelected.bind(this)}>
                                    <option value={-1}>select county</option>
                                    {this.state.wards.map(ward => (
                                        <option
                                            value={ward.id}
                                            className="form-control form-control-sm"
                                            key={ward.id}
                                        >
                                            {ward.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
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
                    RUN QUERY
                </button>
            </div>
        );
    }
}

export default DHIS2Filters;
