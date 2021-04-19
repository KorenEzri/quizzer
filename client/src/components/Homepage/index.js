import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import setCurrentQuestion from "../../redux/redux-actions/setCurrentQuestion";
import setQuestionsFailed from "../../redux/redux-actions/setQuestionsFailed";
import setCurrentChoices from "../../redux/redux-actions/setCurrentChoices";
import classNames from "classnames";
import "./Homepage.css";
import Helpers from "../Helpers";
import Question from "../Question";
import Timer from "../Timer";
import ChoiceBox from "../ChoiceBox";
import BottomHUD from "../BottomHUD";
import StartQuiz from "../StartQuiz";
import RateLastQuestion from "../RateLastQuestion/";
import Score from "../Scoreboard";
import network from "../../network";
const baseUrl = "http://localhost:3001/api/questions/";
const player = localStorage.getItem("anon") || localStorage.getItem("user");

export default function Homepage() {
  const dispatch = useDispatch();
  const [quizStart, setQuizStart] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [score, setScore] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [questionInterval, setQuestionInterval] = useState("");
  const { answered, failed, question } = useSelector((state) => state);

  const fetchQuestion = async (didClick) => {
    const { data } = await network.get(`${baseUrl}question`);
    setShowTimer(false);
    dispatch(setCurrentQuestion(data.question));
    dispatch(setCurrentChoices(data.choices));
    setQuestionType(data.type);
    setShowTimer(true);
    if (!didClick) {
      dispatch(setQuestionsFailed(failed.failedCount));
    }
    console.log(data.choices.rightChoice);
  };
  const handleDifficultyLevel = (questionsAnswered) => {
    if (questionsAnswered > 4) {
      setDifficulty(2);
    }
    if (questionsAnswered > 7) {
      setDifficulty(3);
    }
    if (questionsAnswered > 13) {
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
  const handleQuizStart = async (next) => {
    if (next) {
      clearInterval(questionInterval);
      await fetchQuestion("didClick");
      setQuestionInterval(
        setInterval(async () => {
          await fetchQuestion();
        }, getTimerLength(difficulty))
      );
      return;
    }
    await fetchQuestion("didClick");
    setQuizStart(true);
    setQuestionInterval(
      setInterval(async () => {
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
      <div className="rating-div">
        <RateLastQuestion />
      </div>
      {question && (
        <div
          className={classNames({
            game__container: true,
            mid: difficulty === 3,
            hard: difficulty === 4,
          })}
        >
          <div className="question__container">
            <Question question={question} />
            <div className="scoreboard-container">
              <Score playerScore={score} />
            </div>
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
              questionType={questionType}
              difficulty={difficulty}
              handleQuizStart={handleQuizStart}
            />
          </div>
          {difficulty > 3 && (
            <div className="bottomHUD-container">
              <BottomHUD />
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="pregame-container">
      <StartQuiz handleQuizStart={handleQuizStart} />
    </div>
  );
}
