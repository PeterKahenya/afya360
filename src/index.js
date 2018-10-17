import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";



//CHECK WHETHER ASSIGNED THAT APP ELSE DISALLOW
ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.register();
