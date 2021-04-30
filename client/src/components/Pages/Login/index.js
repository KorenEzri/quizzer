import React from "react";
import LockIcon from "@material-ui/icons/Lock";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import classNames from "classnames";
import HowToUserAuth from "../../HowToUserAuth";
import Navbar from "../../Navbar";
import { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import "./Login.css";

export default function LoginPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const helperRef = useRef(null);

  const HandleTextChange = (event) => {
    setTextInput(event.target.value);
  };
  const HandlePasswordChange = (event) => {
    setPasswordInput(event.target.value);
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
          <button className="login-button" type="button">
            Login
          </button>
          {isValidated && <Redirect to="/" />}
        </div>
      </form>
    </div>
  );
}
