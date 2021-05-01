import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Cookies from "js-cookie";
import { Router, Switch, Route } from "react-router-dom";
import Homepage from "./components/Pages/Homepage";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";
import PrivateRoute from "./components/Pages/PrivateRoute";
import Leaderboards from "./components/Leaderboards";
import setIsLogged from "./redux/redux-actions/setIsLogged";
import network from "./network";
import history from "./history";
const baseUrl = "http://localhost:3001/api/authentication/";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const token = Cookies.get("accessToken");
      if (token) {
        const { data } = await network.post(`${baseUrl}tokenValidate`);
        data.valid === true
          ? dispatch(setIsLogged(true))
          : dispatch(setIsLogged(false));
      } else {
        dispatch(setIsLogged(false));
      }
    })();
  }, []);

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
