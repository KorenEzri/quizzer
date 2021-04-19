import React from "react";
import classNames from "classnames";
import { useState, useRef } from "react";
import "./Form.css";

export default function Form() {
  const [textInput, setTextInput] = useState("");
  const HandleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  return (
    <div>
      <form autoComplete="off">
        <div className="testbox">
          <h4>What's your name?</h4>
          <div className="user-info">
            <input
              type="text"
              name="username"
              onChange={HandleTextChange}
              placeholder="Username"
              required
              autoComplete="off"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
