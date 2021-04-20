import React from "react";
import { useSelector, useDispatch } from "react-redux";
import setQuestionsFailed from "../../../redux/redux-actions/setQuestionsFailed";
import ansEasy from "../../../redux/redux-actions/answers/ansEasy";
import ansMid from "../../../redux/redux-actions/answers/ansMid";
import ansHard from "../../../redux/redux-actions/answers/ansHard";
import failHard from "../../../redux/redux-actions/fails/failHard";
import network from "../../../network";
const askIfCorrect = "http://localhost:3001/api/questions/answer/";

export default function Choice({
  choice,
  index,
  handleQuizStart,
  difficulty,
  choices,
}) {
  const addCommas = (nStr) => {
    nStr += "";
    let x = nStr.split(".");
    let x1 = x[0];
    let x2 = x.length > 1 ? "." + x[1] : "";
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  };

  let pointsToIncrement;
  let pointsToDecrement;
  switch (difficulty) {
    case 1:
      pointsToIncrement = ansEasy;
      pointsToDecrement = setQuestionsFailed;
      break;
    case 2:
      pointsToIncrement = ansEasy;
      pointsToDecrement = setQuestionsFailed;
      break;
    case 3:
      pointsToIncrement = ansMid;
      pointsToDecrement = failHard;
      break;
    case 4:
      pointsToIncrement = ansHard;
      pointsToDecrement = failHard;
      break;
    default:
      break;
  }
  let { answered } = useSelector((state) => state);
  let { failed } = useSelector((state) => state);
  const dispatch = useDispatch();

  const findFullChoice = (userAnswer) => {
    let index;
    choices.forEach((choice, i) => {
      if (choice instanceof Object) {
        Object.values(choice).forEach((value) => {
          if (value === userAnswer) {
            index = i;
          }
        });
      } else if (choice === userAnswer || userAnswer === addCommas(choice)) {
        index = i;
      }
    });
    return choices[index];
  };

  return (
    <li
      key={`choice-${index}`}
      className="choicebox__choice"
      onClick={async ({ target }) => {
        const userAnswer = findFullChoice(target.textContent);
        console.log(userAnswer);
        const { data } = await network.put(askIfCorrect, {
          answer: userAnswer,
          difficulty: difficulty,
        });
        if (data) {
          dispatch(pointsToIncrement(answered.answerCount));
          await handleQuizStart("next");
        } else {
          dispatch(pointsToDecrement(failed.failedCount));
          await handleQuizStart("next");
        }
      }}
    >
      {Number(choice) ? addCommas(choice) : choice}
    </li>
  );
}
