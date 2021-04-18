import React from "react";
import { useSelector, useDispatch } from "react-redux";
import setQuestionsAnswered from "../../../redux/redux-actions/setQuestionsAnswered";
import setQuestionsFailed from "../../../redux/redux-actions/setQuestionsFailed";
import setCurrentQuestion from "../../../redux/redux-actions/setCurrentQuestion";

export default function Choice({ choice, isRight, index, handleQuizStart }) {
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
          dispatch(setQuestionsAnswered(answered.answerCount));
          await handleQuizStart("next");
        } else {
          dispatch(setQuestionsFailed(failed.failedCount));
          await handleQuizStart("next");
        }
      }}
    >
      <span key={`choice_span${index}`} className="choice__number"></span>
      {choice}
    </li>
  );
}
