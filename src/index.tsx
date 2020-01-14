import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "./index.css";
import "antd/dist/antd.css";

// or 'antd/dist/antd.less'

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
