import React, { Component } from "react";
import "jquery";

class Facility extends Component {
  render() {
    let facility = this.props.facility;
    var id = "facility" + this.props.id;
    return (
      <div
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
                <span
                  className="bg-primary"
                  style={{
                    color: "#fff",
                    fontSize: "3em"
                  }}
                >
                  {facility.code}
                </span>
                <span className="h1">{facility.name}</span>
                <span
                  style={{
                    background: "#008080",
                    color: "#fff",
                    float: "right"
                  }}
                >
                  {facility.operation_status_name}
                </span>
              </div>
            </div>
            <div className="card-body text-primary">
              <h6 className="card-text">{facility.location_desc}</h6>
              County: <h4 className="card-title">{facility.county_name}</h4>
              Sub County:{" "}
              <h5 className="card-title">{facility.sub_county_name}</h5>
              Ward: <h6 className="card-text">{facility.ward_name}</h6>
            </div>
            <p>
              <button
                className="btn btn-primary"
                type="button"
                data-toggle="collapse"
                data-target={"#" + id}
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                View More
              </button>
            </p>
            <div className="collapse" id={id}>
              <div className="card card-body">
                {facility.facility_services.map(service => (
                  <div
                    className="alert alert-primary"
                    key={service.service_code}
                    role="alert"
                  >
                    {service.service_name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Facility;
