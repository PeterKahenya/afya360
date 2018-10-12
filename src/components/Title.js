import React, { Component } from "react";

class Title extends Component {
    constructor(props) {
        super(props);
        this.state = { name: "Facilities360" };
    }
    render() {
        return (
            <div
                className={this.props.cname}
            >
                {this.state.name}
            </div>
        );
    }
}

export default Title;
