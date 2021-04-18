import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import setCurrentQuestion from "../../redux/redux-actions/setCurrentQuestion";
import setQuestionsFailed from "../../redux/redux-actions/setQuestionsFailed";
import classNames from "classnames";
import "./Homepage.css";
import Helpers from "../Helpers";
import Question from "../Question";
import Timer from "../Timer";
import ChoiceBox from "../ChoiceBox";
import BottomHUD from "../BottomHUD";
import StartQuiz from "../StartQuiz";
import Score from "../Scoreboard";
import network from "../../network";
const baseUrl = "http://localhost:3001/api/questions/";

export default function Homepage() {
  const dispatch = useDispatch();
  const [quizStart, setQuizStart] = useState(false);
  const [choices, setChoices] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [showTimer, setShowTimer] = useState(false);
  const [questionInterval, setQuestionInterval] = useState("");
  const [score, setScore] = useState(0);
  const { answered } = useSelector((state) => state);
  const { failed } = useSelector((state) => state);
  const { question } = useSelector((state) => state);

  const fetchQuestion = async () => {
    const { data } = await network.get(`${baseUrl}question`);
    setShowTimer(false);
    dispatch(setCurrentQuestion(data.question));
    setChoices(data.choices);
    setQuestionType(data.type);
    setShowTimer(true);
    console.log(data.choices.rightChoice, difficulty);
  };
  const handleDifficultyLevel = (questionsAnswered) => {
    if (questionsAnswered > 3) {
      setDifficulty(2);
    }
    if (questionsAnswered > 6) {
      setDifficulty(3);
    }
    if (questionsAnswered > 12) {
      setDifficulty(4);
    }
  };
  const getTimerLength = (n) => {
    switch (n) {
      case 1:
        return 12700;
      case 2:
        return 8700;
      case 3:
        return 5500;
      case 4:
        return 3000;
      default:
        return 12700;
    }
  };
  const handleQuizStart = async (next, didClick) => {
    if (next) {
      clearInterval(questionInterval);
      await fetchQuestion();
      setQuestionInterval(
        setInterval(async () => {
          await fetchQuestion();
        }, getTimerLength(difficulty))
      );
      return;
    }
    await fetchQuestion();
    setQuizStart(true);
    setQuestionInterval(
      setInterval(async () => {
        if (!didClick) {
          dispatch(setQuestionsFailed(failed.failedCount));
        }
        await fetchQuestion();
      }, getTimerLength(difficulty))
    );
  };

  useEffect(() => {
    (() => {
      setScore(answered.answerCount - failed.failedCount);
      handleDifficultyLevel(answered.answerCount);
    })();
  }, [answered.answerCount, failed.failedCount]);

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
              duration_four: difficulty === 4,
            })}
          >
            {showTimer && <Timer />}
          </div>
          <div className="helpers-container">
            <Helpers />
          </div>
          <div className="choicebox-container">
            <ChoiceBox
              choices={choices}
              questionType={questionType}
              handleQuizStart={handleQuizStart}
            />
          </div>
          <div className="bottomHUD-container">
            <BottomHUD />
          </div>
          <div className="scoreboard-container">
            <Score playerScore={score} />
          </div>
        </div>
      )}
    </div>
  ) : (
    <StartQuiz handleQuizStart={handleQuizStart} />
  );
}
