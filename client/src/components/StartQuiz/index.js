import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import history from "../../history";
import network from "../../network";
import "./StartQuiz.css";
import simpsonImage from "./sim.jpg";

export default function StartQuiz({ handleQuizStart }) {
  return (
    <div
      className="start-quiz-component"
      onKeyPress={async (e) => {
        if (e.key === "Enter") {
          await handleQuizStart();
        } else {
          return;
        }
      }}
    >
      <div>
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
          <button className="logout-button">Log out</button>
          <button
            className="start-button"
            onClick={async () => {
              await handleQuizStart();
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
