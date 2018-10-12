import React, { Component } from 'react';


class DHIS2Facility extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        var facility = this.props.facility
        return (<div
            className="results_list"
            style={{
                paddingTop: "30px",
                paddingLeft: "0px",
                flexDirection: "-moz-initial"
            }}
        >
            <div>
                <div className="card border-primary mb-3" style={{ maxWidth: "80%" }}>
                    <div className="card-header">
                        <div>
                            <span className="bg-primary"
                                style={{
                                    color: "#fff", fontSize: "3em"
                                }}>
                                {facility.code}
                            </span>
                            <span className="h1">{facility.displayName}</span>
                            <span
                                style={{
                                    background: "#008080",
                                    color: "#fff",
                                    float: "right"
                                }}
                            >
                                {facility.shortName}
                            </span>
                        </div>
                    </div>
                    <div className="card-body text-primary">
                        <h6 className="card-text">{facility.comment}</h6>
                        Coordinates: <h4 className="card-title">{facility.coordinates}</h4>
                        Opening Date: <h5 className="card-title">{facility.openingDate}</h5>
                        Ward: <h6 className="card-text">{facility.created}</h6>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default DHIS2Facility;