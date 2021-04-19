import React from "react";
import { useState, useEffect } from "react";
import network from "../../network";
const baseUrl = "http://localhost:3001/api/users/createanon";

export default function StartQuiz({ handleQuizStart }) {
  const [textInput, setTextInput] = useState("");
  const [user, setUser] = useState(localStorage.getItem("anon"));

  const handleLocalStorage = (action, input) => {
    if (action === "remove") {
      localStorage.removeItem("anon");
      setUser("");
    } else {
      localStorage.setItem("anon", input);
      setUser(input);
    }
  };

  const HandleTextChange = (event) => {
    setTextInput(event.target.value);
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
          </div>
        ) : (
          <button
            className="logout-button"
            onClick={() => {
              handleLocalStorage("remove");
            }}
          >
            Log out
          </button>
        )}
      </div>
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
  );
}
