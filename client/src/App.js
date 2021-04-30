import React from "react";
import "./App.css";
import { Router, Switch, Route } from "react-router-dom";
import Homepage from "./components/Pages/Homepage";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";
import PrivateRoute from "./components/Pages/PrivateRoute";
import Leaderboards from "./components/Leaderboards";
import history from "./history";

function App() {
  return (
    <Router history={history}>
      <div className="top-container">
        <Switch>
          <PrivateRoute exact path="/" component={Homepage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/leaderboards" component={Leaderboards} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
