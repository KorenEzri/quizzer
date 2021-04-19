import React from "react";
import "./App.css";
import { Router, Switch, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Leaderboards from "./components/Leaderboards";
import history from "./history";

function App() {
  return (
    <Router history={history}>
      <div className="top-container">
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/leaderboards" component={Leaderboards} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
