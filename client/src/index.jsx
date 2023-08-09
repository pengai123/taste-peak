import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
//Standalone runtime for Regenerator-compiled generator and async functions.
import regeneratorRuntime from "regenerator-runtime";

ReactDOM.render(<App />, document.getElementById("app"));