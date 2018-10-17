import React, { Component } from 'react';
import { updatedhis2, dhis2query, dhis2_add_facility, dropOrg } from "../workers/worker.js"
import CircularProgress from '@material-ui/core/CircularProgress';

class ResolutionItem extends Component {
    constructor(props) {
        super(props);
        this.state = { update_state: 0 }
    }


    add(e) {
        var facility = this.props.resolution.mfl
        this.setState({ update_state: 1 })
        dhis2query("organisationUnits.json?filter=level:eq:4&filter=displayName:ilike:" + facility.ward_name.replace(/'/g, "")).then(resp => {
            var parent = resp.organisationUnits[0].id;
            var payload = {
                name: facility.name,
                shortName: "SHRT",
                openingDate: facility.openingDate
                    ? facility.openingDate
                    : "1990-01-01T00:00:00.000",
                parent: {
                    id: parent
                },
                coordinates: facility.lat_long ? JSON.stringify([
                    facility.lat_long[1],
                    facility.lat_long[0]
                ]) : JSON.stringify([0, 0]),
                code: JSON.stringify(facility.code)
            };
            dhis2_add_facility(payload).then(res => {
                alert(res.httpStatusCode)
                alert(res.httpStatus)
                if (res.httpStatusCode === 201) {
                    this.setState({
                        update_state: 2
                    });
                }
                else {
                    this.setState({
                        update_state: 2
                    });

                }
            });
        });


    }
    drop(e) {
        var facility = this.props.resolution;
        this.setState({ update_state: 1 })
        dropOrg(facility.dhis.id).then(resp => {
            this.setState({
                update_state: 2
            });
            alert(resp)
        })
    }

    updateCode(e) {
        var facility = this.props.resolution
        this.setState({ update_state: 1 });
        updatedhis2(e.target.id, {
            coordinates: facility.dhis.coordinates,
            name: facility.dhis.displayName,
            code: facility.mfl.code,//UPDATE WITH THE MFL CODE
            shortName: facility.dhis.shortName,
            openingDate: facility.dhis.openingDate
        }).then(res => {
            if (res.httpStatusCode === 200) {
                console.log("Update Code done")
                this.setState({
                    update_state: 2
                });

            }
        });

    }
    updateName(e) {
        var facility = this.props.resolution
        this.setState({ update_state: 1 });
        updatedhis2(e.target.id, {
            name: facility.mfl.name,//UPDATE WITH MFL NAME
            shortName: facility.dhis.shortName,
            openingDate: facility.dhis.openingDate
        }).then(res => {
            if (res.httpStatusCode === 200) {
                console.log("Update Name done")
                this.setState({
                    update_state: 2
                });
            }
        });

    }
    updateGeo(e) {
        var facility = this.props.resolution
        this.setState({ update_state: 1 });
        console.log(this.state)
        updatedhis2(e.target.id, {
            coordinates: JSON.stringify(facility.mfl.lat_long),//UPDATE WITH DHIS2 NAME
            name: facility.dhis.displayName,
            shortName: facility.dhis.shortName,
            openingDate: facility.dhis.openingDate
        }).then(res => {
            if (res.httpStatusCode === 200) {
                console.log("Update geo done")
                this.setState({ update_state: 2 });
            }


        });
    }
    render() {
        var resolution = this.props.resolution;
        var resolvTable = null;
        if (!resolution.exists_in_dhis) {
            resolvTable = this.getAddTable(resolution)
        } else {
            if (!resolution.exists_in_mfl) {
                resolvTable = this.getDropTable(resolution)
            } else {
                resolvTable = this.getUpdateTable(resolution)
            }
        }

        return (<div style={{ paddingTop: "50px" }}>
            <div className="card shadow">{resolvTable}</div>
        </div>);
    }


    getAddTable(resolution) {
        var theState = "";
        switch (this.state.update_state) {
            case 0:
                theState = "Add to dhis2"
                break;
            case 1:
                theState = <CircularProgress size={24} className="btn-success" />;
                break;
            case 2:
                theState = "DONE"
                break;
            default:
                break;
        }
        var coordinates = resolution.mfl.lat_long === "undefined" || resolution.mfl.lat_long === null ? [0, 0] : resolution.mfl.lat_long
        return (<table className="table"><thead><tr><th scope="col">DHIS</th><th scope="col">MFL</th><th scope="col"></th></tr></thead>
            <tbody>
                <tr >
                    <td></td>
                    <td>{resolution.mfl.name}</td>
                    <td><button className={"btn btn-" + this.update_state !== 2 ? "primary" : "success"} onClick={this.add.bind(this)}>
                        {theState} </button></td>
                </tr>
                <tr >
                    <td></td>
                    <td>{resolution.mfl.code}</td>
                    <td></td>
                </tr>
                <tr >
                    <td></td>
                    <td>{"[" + coordinates[0] + "," + coordinates[1] + "]"}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>)

    }

    getDropTable(resolution) {
        var theState = "";
        switch (this.state.update_state) {
            case 0:
                theState = "delete"
                break;
            case 1:
                theState = <CircularProgress size={24} className="btn-success" />;
                break;
            case 2:
                theState = "DONE"
                break;
            default:
                break;
        }
        var coordinates = resolution.dhis.coordinates === undefined || resolution.dhis.coordinates === null ? [0, 0] : JSON.parse(resolution.dhis.coordinates)
        return (<table className="table"><thead><tr><th scope="col">DHIS</th><th scope="col">MFL</th><th scope="col"></th></tr></thead>
            <tbody>
                <tr >
                    <td>{resolution.dhis.displayName}</td>
                    <td></td>
                    <td><button className={"btn btn-" + this.update_state !== 2 ? "primary" : "success"} onClick={this.drop.bind(this)} >{theState}</button></td>
                </tr>
                <tr >
                    <td>{resolution.dhis.code}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr >
                    <td>{"[" + coordinates[1] + "," + coordinates[0] + "]"}</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>)
    }

    getUpdateTable(resolution) {
        var theState = "";
        switch (this.state.update_state) {
            case 0:
                theState = "update dhis2"
                break;
            case 1:
                theState = <CircularProgress size={24} />;
                break;
            case 2:
                theState = "DONE"
                break;
            default:
                break;
        }
        var mflcoordinates = resolution.mfl.lat_long === undefined || resolution.mfl.lat_long === null ? [0, 0] : resolution.mfl.lat_long
        var dhiscoordinates = null
        try {
            dhiscoordinates = JSON.parse(resolution.dhis.coordinates)
        } catch (e) {
            dhiscoordinates = [0, 0]
        }
        return (<table className="table"><thead><tr><th scope="col">DHIS</th><th scope="col">MFL</th><th scope="col"></th></tr></thead>
            <tbody>
                <tr className={resolution.mfl.name === resolution.dhis.displayName ? "" : "table-danger"} >
                    <td>{resolution.dhis.displayName}</td>
                    <td>{resolution.mfl.name}</td>
                    <td>{resolution.mfl.name === resolution.dhis.displayName ? "" : <button data-toggle="modal"
                        data-target="#exampleModalCenter" className="btn btn-primary" onClick={this.updateName.bind(this)} id={resolution.dhis.id}>{theState}</button>}</td>
                </tr>
                <tr className={resolution.mfl.code === parseInt(resolution.dhis.code) ? "" : "table-danger"} >
                    <td>{resolution.dhis.code}</td>
                    <td>{resolution.mfl.code}</td>
                    <td>{resolution.mfl.code === parseInt(resolution.dhis.code) ? "" : <button data-toggle="modal"
                        data-target="#exampleModalCenter" className="btn btn-primary" onClick={this.updateCode.bind(this)}>{theState}</button>}</td>
                </tr>
                <tr className={dhiscoordinates[1] === mflcoordinates[0] && dhiscoordinates[0] === mflcoordinates[1] ? "" : "table-danger"} >
                    <td>{"[" + dhiscoordinates[1] + "," + dhiscoordinates[0] + "]"}</td>
                    <td>{"[" + mflcoordinates[0] + "," + mflcoordinates[1] + "]"}</td>
                    <td>{dhiscoordinates[1] === mflcoordinates[0] && dhiscoordinates[0] === mflcoordinates[1] ? "" : <button data-toggle="modal"
                        data-target="#exampleModalCenter" className="btn btn-primary" onClick={this.updateGeo.bind(this)} id={resolution.dhis.id}>{theState}</button>}</td>
                </tr>
            </tbody>
        </table>)
    }

}


export default ResolutionItem;