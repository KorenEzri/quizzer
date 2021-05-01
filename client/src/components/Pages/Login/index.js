import React from "react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import LockIcon from "@material-ui/icons/Lock";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import classNames from "classnames";
import HowToUserAuth from "../../HowToUserAuth";
import Navbar from "../../Navbar";
import network from "../../../network";
import setIsLogged from "../../../redux/redux-actions/setIsLogged";
import "./Login.css";
const baseUrl = "http://localhost:3001/api/authentication/";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { isLogged } = useSelector((state) => state);
  const [passwordInput, setPasswordInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const helperRef = useRef(null);

  const HandleTextChange = (event) => {
    setTextInput(event.target.value);
  };
  const HandlePasswordChange = (event) => {
    setPasswordInput(event.target.value);
  };
  const sendLoginQuery = async (username, password, setter) => {
    if (username && password) {
      try {
        const { data } = await network.post(`${baseUrl}login`, {
          username: username,
          password: password,
        });
        if (data.refreshToken && data.accessToken) {
          dispatch(setIsLogged(true));
          Cookies.set("accessToken", data.accessToken);
          Cookies.set("refreshToken", data.refreshToken);
          Cookies.set("nickname", data.nickname);
          Cookies.set("email", data.email);
        }
      } catch ({ message }) {
        console.log(message);
      }
    }
  };
  return (
    <div>
      <Navbar />
      <div
        className={classNames({
          "explainer-edit": true,
          bounceInUp: true,
        })}
        ref={helperRef}
      >
        <HowToUserAuth helperRef={helperRef} />
      </div>
      <form autoComplete="off">
        <div className="testbox">
          <h1>Employee Login</h1>
          <div className="user-info">
            <input
              type="text"
              name="username"
              onChange={HandleTextChange}
              placeholder="Username"
              required
              autoComplete="off"
            />
            <AccountCircleIcon className="icons" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={HandlePasswordChange}
              required
              autoComplete="off"
            />
            <LockIcon className="icons" />
          </div>
          <button
            className="login-button"
            type="button"
            onClick={async () => {
              await sendLoginQuery(textInput, passwordInput);
            }}
          >
            Login
          </button>
          {isLogged && <Redirect to="/" />}
        </div>
      </form>
    </div>
  );
}
