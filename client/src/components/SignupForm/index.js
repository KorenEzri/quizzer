import React from "react";
import { useState, useRef } from "react";
import "./Signup.css";
import Swal from "sweetalert2";
import network from "../../network";
import withReactContent from "sweetalert2-react-content";

export default function SignupForm() {
  const MySwal = withReactContent(Swal);
  const [textInput, setTextInput] = useState("");
  const HandleTextChange = (event) => {
    setTextInput(event.target.value);
  };
  MySwal.fire({
    title: (
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
    ),
    footer: "Be one of the greats.",
    confirmButtonText: "Get started",
    didOpen: () => {
      // `MySwal` is a subclass of `Swal`
      //   with all the same instance & static methods
      //   MySwal.clickConfirm();
    },
  }).then(() => {
    return network.post();
  });

  return <div></div>;
}
