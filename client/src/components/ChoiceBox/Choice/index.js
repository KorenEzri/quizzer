import React from "react";
import { useSelector, useDispatch } from "react-redux";
import setQuestionsAnswered from "../../../redux/redux-actions/setQuestionsAnswered";
import setQuestionsFailed from "../../../redux/redux-actions/setQuestionsFailed";
import setCurrentQuestion from "../../../redux/redux-actions/setCurrentQuestion";

export default function Choice({ choice, isRight, index }) {
  let { answered } = useSelector((state) => state);
  let { failed } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <li
      key={`choice-${index}`}
      className="choicebox__choice"
      isright={`${isRight}`}
      onClick={({ target }) => {
        const isCorrect = target.getAttribute("isright");
        if (isCorrect) {
          dispatch(setQuestionsAnswered(answered++));
          dispatch(setCurrentQuestion());
        } else {
          dispatch(setQuestionsFailed(failed++));
          dispatch(setCurrentQuestion());
        }
        console.log(answered, failed);
      }}
    >
      <span key={`choice_span${index}`} className="choice__number">
        {index} -
      </span>
      {choice}
    </li>
  );
}
