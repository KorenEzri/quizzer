import React, { useState, useEffect } from "react";
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
import NavButtons from "../NavButtons";
import LostTheGame from "../LostTheGame";
import network from "../../network";
const baseUrl = "http://localhost:3001/api/questions/";
const saveHighscore = "http://localhost:3001/api/users/highscore/";
const triggerRatingSequence =
  "http://localhost:3001/api/rating/triggersequence";

export default function Homepage() {
  const dispatch = useDispatch();
  const [quizStart, setQuizStart] = useState(false);
  const [lostGame, setLostGame] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [questionType, setQuestionType] = useState("");
  const [questionInterval, setQuestionInterval] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startDate, setStartDate] = useState(0);
  let { answered, failed, question } = useSelector((state) => state);

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
      const currentDate = new Date();
      setElapsedTime(currentDate - Date.parse(startDate));
      clearInterval(questionInterval);
      await fetchQuestion("didClick");
      setQuestionInterval(
        setInterval(async () => {
          await fetchQuestion();
        }, getTimerLength(difficulty))
      );
      return;
    }
    await network.get(`${baseUrl}/end`);
    setStartDate(new Date());
    await fetchQuestion("didClick");
    setQuizStart(true);
    setQuestionInterval(
      setInterval(async () => {
        await fetchQuestion();
      }, getTimerLength(difficulty))
    );
  };
  const handleGameEnd = async () => {
    await network.post(triggerRatingSequence, { score });
    const endDate = new Date();
    setElapsedTime(endDate - Date.parse(startDate));
    clearInterval(questionInterval);
    await network.post(saveHighscore, {
      score,
      user: localStorage.getItem("anon"),
      elapsedTime,
    });
  };

  useEffect(() => {
    (async () => {
      if (!quizStart) return;
      if (failed.failedCount > 2) {
        setLostGame(true);
        await handleGameEnd();
        return;
      }
      setScore(answered.answerCount - failed.failedCount);
      handleDifficultyLevel(answered.answerCount);
    })();
  }, [answered, failed]);

  return quizStart ? (
    <div className="homepage-top-container">
      {lostGame && <LostTheGame />}
      {!lostGame ? (
        <div className="rating-div">
          <RateLastQuestion elapsedTime={elapsedTime} />
        </div>
      ) : (
        <div className="lost_game_homebuttons">
          <NavButtons />
        </div>
      )}
      {question && (
        <div
          className={classNames({
            game__container: true,
            mid: difficulty === 3,
            hard: difficulty === 4,
            lost: lostGame,
          })}
        >
          <div className="question__container">
            <Question question={question} />
            <div className="scoreboard-container">
              {localStorage.getItem("anon")} <Score playerScore={score} />
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
            {!lostGame && (
              <ChoiceBox
                questionType={questionType}
                difficulty={difficulty}
                handleQuizStart={handleQuizStart}
              />
            )}
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
