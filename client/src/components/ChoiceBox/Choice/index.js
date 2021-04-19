import React from "react";
import { useSelector, useDispatch } from "react-redux";
import setQuestionsFailed from "../../../redux/redux-actions/setQuestionsFailed";
import ansEasy from "../../../redux/redux-actions/answers/ansEasy";
import ansMid from "../../../redux/redux-actions/answers/ansMid";
import ansHard from "../../../redux/redux-actions/answers/ansHard";
import failHard from "../../../redux/redux-actions/fails/failHard";
export default function Choice({
  choice,
  isRight,
  index,
  handleQuizStart,
  difficulty,
}) {
  const addCommas = (nStr) => {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
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
      pointsToDecrement = failHard;
      pointsToIncrement = ansHard;
      break;
    default:
      break;
  }
  let { answered } = useSelector((state) => state);
  let { failed } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <li
      key={`choice-${index}`}
      className="choicebox__choice"
      isright={`${isRight}`}
      onClick={async ({ target }) => {
        const isCorrect = target.getAttribute("isright") === "true";
        if (isCorrect) {
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
