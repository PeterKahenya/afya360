import React, { Component } from 'react';
import ResolutionItem from "./ResolutionItem"
import { mflquery, dhis2query } from '../workers/worker.js';
import { load } from "./load.gif"


export default class Resolutions extends Component {
    constructor(props) {
        super(props);
        this.state = { resolutions: [], progress: 0, status: 0 }
    }

    render() {
        console.log(this.state.progress)
        return (<div style={{ paddingLeft: "177px", paddingRight: "177px" }}>
            {this.state.progress > 0 && this.progress !== 1 ? "" : "Awaiting search..."}
            {this.state.resolutions.map(resolution => {

                return (<ResolutionItem resolution={resolution} changeStatus={this.changeStatus} key={resolution.exists_in_mfl ? resolution.mfl.id : resolution.dhis.id} />);
            })}
        </div>);
    }

    compareWithKMHFL(results) {
        var resolutions = []
        results.map((orgunit, index) => {
            var progress = ((index + 1) / results.length)
            this.setState({ progress: progress })
            console.log(this.state.progress, ((index + 1) / results.length))
            mflquery("facilities/facilities/?format=json&name=" + orgunit.displayName + "&code=" + orgunit.code).then(resp => {
                if (resp.results.length !== 1) {
                    mflquery("facilities/facilities/?format=json&name=" + orgunit.displayName).then(resp => {
                        if (resp.results.length !== 1) {
                            mflquery("facilities/facilities/?format=json&code=" + orgunit.code).then(resp => {
                                if (resp.results.length !== 1) {
                                    //console.log("Facility does not exist in MFL")
                                    resolutions.push({
                                        mfl: null,
                                        dhis: orgunit,
                                        exists_in_mfl: false,
                                        exists_in_dhis: true
                                    })
                                    this.setState({ resolutions: resolutions })
                                } else {
                                    //console.log("MFL CODE MATCH")
                                    resolutions.push({
                                        mfl: resp.results[0],
                                        dhis: orgunit,
                                        exists_in_mfl: true,
                                        exists_in_dhis: true
                                    })
                                    // console.log(resolutions)
                                    this.setState({ resolutions: resolutions })
                                }
                            });
                        } else {
                            // console.log("MFL Name MATCH")
                            resolutions.push({
                                mfl: resp.results[0],
                                dhis: orgunit,
                                exists_in_mfl: true,
                                exists_in_dhis: true
                            })
                            this.setState({ resolutions: resolutions })
                        }
                    });
                } else {
                    //console.log("MFL NAME and CODE MATCH")
                    resolutions.push({
                        mfl: resp.results[0],
                        dhis: orgunit,
                        exists_in_mfl: true,
                        exists_in_dhis: true
                    })
                    // console.log(resolutions)
                    this.setState({ resolutions: resolutions })
                }

            });
        });

    }



    compareWithDHIS2(results) {
        var resolutions = [];
        results.map((facility, index) => {
            var progress = ((index + 1) / results.length)
            this.setState({ progress: progress })
            dhis2query("organisationUnits.json?filter=level:eq:5&filter=displayName:ilike:" + facility.name + "&filter=code:eq:" + facility.code).then(resp => {
                if (resp.pager.total !== 1) {
                    dhis2query("organisationUnits.json?filter=level:eq:5&filter=code:eq:" + facility.code).then(resp => {
                        if (resp.pager.total !== 1) {
                            dhis2query("organisationUnits.json?filter=level:eq:5&filter=displayName:ilike:" + facility.name).then(resp => {
                                if (resp.pager.total !== 1) {
                                    resolutions.push({
                                        mfl: facility,
                                        dhis: null,
                                        exists_in_mfl: true,
                                        exists_in_dhis: false
                                    })
                                    this.setState({ resolutions: resolutions })

                                } else {
                                    var org = resp.organisationUnits[0];
                                    dhis2query("organisationUnits/" + org.id + ".json").then(detailed => {
                                        resolutions.push({
                                            mfl: facility,
                                            dhis: detailed,
                                            exists_in_mfl: true,
                                            exists_in_dhis: true
                                        })
                                        this.setState({ resolutions: resolutions })
                                    });

                                }
                            })
                        } else {
                            var org = resp.organisationUnits[0];
                            dhis2query("organisationUnits/" + org.id + ".json").then(detailed => {
                                resolutions.push({
                                    mfl: facility,
                                    dhis: detailed,
                                    exists_in_mfl: true,
                                    exists_in_dhis: true
                                })
                                this.setState({ resolutions: resolutions })
                            });
                        }

                    })
                } else {
                    var org = resp.organisationUnits[0];
                    dhis2query("organisationUnits/" + org.id + ".json").then(detailed => {
                        resolutions.push({
                            mfl: facility,
                            dhis: detailed,
                            exists_in_mfl: true,
                            exists_in_dhis: true
                        })
                        this.setState({ resolutions: resolutions })
                    })

                }
            })
        })
    }

    componentWillReceiveProps(props) {
        this.setState({ resolutions: [] })
        if (props.status === 1) {
            if (props.system === "KMHFL") {
                this.compareWithDHIS2(props.results)
            } else {
                this.compareWithKMHFL(props.results)
            }
        }

    }

}

