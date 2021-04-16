import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
} from "react-router-dom";
import Homepage from "./components/Homepage";

function App() {
  return (
    <Router>
      <div className="top-container">
        <div className="nav-container">
          <nav className="main__nav">
            <NavLink
              exact={true}
              className="link"
              activeClassName="is-active"
              to={"/"}
            >
              Overview
            </NavLink>
            <NavLink
              exact={true}
              className="link"
              activeClassName="is-active"
              to={`/playlist/:id`}
            >
              playlist
            </NavLink>
            <NavLink
              exact={true}
              className="link"
              activeClassName="is-active"
              to={`/artist/:id`}
            >
              artist
            </NavLink>
          </nav>
        </div>
        <Switch>
          <Route exact path="/" component={Homepage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
