import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
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
  const [difficulty, setDifficulty] = useState(3);
  const [showTimer, setShowTimer] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsFailed, setQuestionsFailed] = useState(0);

  const fetchQuestion = async () => {
    const { data } = await network.get(`${baseUrl}question`);
    setQuestion(data.question);
    setChoices(data.choices);
    setQuestionType(data.type);
  };

  const handleQuizStart = async () => {
    await fetchQuestion();
    setQuizStart(true);
    setShowTimer(true);
  };

  const getTimerLength = (n) => {
    switch (n) {
      case 1:
        return 12700;
      case 2:
        return 8700;
      case 3:
        return 5800;
      default:
        return 12700;
    }
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      await fetchQuestion();
    }, getTimerLength(difficulty));
    return () => {
      clearInterval(timer);
    };
  }, []);

  return quizStart ? (
    <div className="homepage-top-container">
      {question && (
        <div className="game__container">
          <div className="question__container">
            <Question question={question} />
          </div>
          <div
            className={classNames({
              "timer-container": true,
              duration_one: difficulty === 1,
              duration_two: difficulty === 2,
              duration_three: difficulty === 3,
            })}
          >
            {showTimer && <Timer />}
          </div>
          <div className="helpers-container">
            <Helpers />
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
