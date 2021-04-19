import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import history from "../../history";
import network from "../../network";
import "./StartQuiz.css";
import simpsonImage from "./sim.jpg";
const baseUrl = "http://localhost:3001/api/users/createanon";

export default function StartQuiz({ handleQuizStart }) {
  const [textInput, setTextInput] = useState("");
  const [user, setUser] = useState(localStorage.getItem("anon"));

  const HandleTextChange = (event) => {
    setTextInput(event.target.value);
  };
  const handleLocalStorage = (action, input) => {
    if (action === "remove") {
      localStorage.removeItem("anon");
      setUser("");
    } else {
      localStorage.setItem("anon", input);
      setUser(input);
    }
  };

  return (
    <div
      className="start-quiz-component"
      onKeyPress={async (e) => {
        if (e.key === "Enter") {
          if (!textInput.length) {
            alert("enter your name!");
            return;
          }
          await network.post(baseUrl, { user: textInput });
          handleLocalStorage(null, `${textInput}`);
          await handleQuizStart();
        } else {
          return;
        }
      }}
    >
      <div>
        {!user ? (
          <div className="regbox">
            <img src={simpsonImage} className="open-image" alt="simpsonimage" />
            <NavLink
              exact={true}
              className="link"
              activeClassName="is-active"
              to={"/leaderboards"}
            >
              <h1
                className="leaderboards__link"
                onClick={() => {
                  history.push("/leaderboards");
                }}
              >
                Leaderboards
              </h1>
            </NavLink>

            <h4 className="name-h4">What's your name?</h4>
            <div className="user-info">
              <input
                type="text"
                name="username"
                onChange={HandleTextChange}
                placeholder="name"
                required
                className="name-input"
                autoComplete="off"
              />
            </div>
            <button
              className="start-button __nouser"
              onClick={async () => {
                if (!textInput.length && !user) {
                  alert("enter your name!");
                  return;
                }
                if (!user) {
                  handleLocalStorage(null, `${textInput}`);
                  await network.post(baseUrl, { user: textInput });
                }
                await handleQuizStart();
              }}
            >
              Start
            </button>
          </div>
        ) : (
          <div className="buttons-div__startQuiz">
            <img src={simpsonImage} className="open-image" alt="simpsonimage" />
            <NavLink
              exact={true}
              className="link"
              activeClassName="is-active"
              to={"/leaderboards"}
            >
              <h1
                className="leaderboards__link"
                onClick={() => {
                  history.push("/leaderboards");
                }}
              >
                Leaderboards
              </h1>
            </NavLink>
            <button
              className="logout-button"
              onClick={() => {
                handleLocalStorage("remove");
              }}
            >
              Log out
            </button>
            <button
              className="start-button"
              onClick={async () => {
                if (!textInput.length && !user) {
                  alert("enter your name!");
                  return;
                }
                if (!user) {
                  handleLocalStorage(null, `${textInput}`);
                  await network.post(baseUrl, { user: textInput });
                }
                await handleQuizStart();
              }}
            >
              Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
