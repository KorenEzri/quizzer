import React, { useState, useEffect, useRef } from "react";
import "./Homepage.css";
import Helpers from "../Helpers";
import Question from "../Question";
import Timer from "../Timer";
import ChoiceBox from "../ChoiceBox";
import BottomHUD from "../BottomHUD";
import StartQuiz from "../StartQuiz";
import network from "../../network";
const baseUrl = "http://localhost:3001/api/questions/";

export default function Homepage() {
  const [question, setQuestion] = useState("");
  const [quizStart, setQuizStart] = useState(false);
  const [choices, setChoices] = useState([]);
  const [questionType, setQuestionType] = useState("");

  const fetchQuestion = async () => {
    const { data } = await network.get(`${baseUrl}question`);
    setQuestion(data.question);
    setChoices(data.choices);
    setQuestionType(data.type);
  };
  const handleQuizStart = async () => {
    await fetchQuestion();
    setQuizStart(true);
  };

  return quizStart ? (
    <div className="homepage-top-container">
      <div className="helpers-container">
        <Helpers />
      </div>
      <div className="question-container">
        <Question question={question} />
      </div>
      {question && (
        <div className="game_started">
          <div className="timer-container">
            <Timer />
          </div>
          <div className="choicebox-container">
            <ChoiceBox choices={choices} questionType={questionType} />
          </div>
          <div className="bottomHUD-container">
            <BottomHUD />
          </div>
        </div>
      )}
    </div>
  ) : (
    <StartQuiz handleQuizStart={handleQuizStart} />
  );
}
