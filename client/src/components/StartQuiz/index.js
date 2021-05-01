import React from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import setIsLogged from "../../redux/redux-actions/setIsLogged";
import { NavLink } from "react-router-dom";
import history from "../../history";
import network from "../../network";
import "./StartQuiz.css";
import simpsonImage from "./sim.jpg";
const baseUrl = "http://localhost:3001/api/authentication/";

export default function StartQuiz({ handleQuizStart }) {
  const dispatch = useDispatch();
  const logOut = async () => {
    const { data } = await network.post(`${baseUrl}logout`, {
      token: Cookies.get("refreshToken"),
    });
    console.log(data);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("username");
    Cookies.remove("nickname");
    Cookies.remove("email");
    dispatch(setIsLogged(false));
  };
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
          <button
            className="logout-button"
            onClick={() => {
              logOut();
            }}
          >
            Log out
          </button>
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
