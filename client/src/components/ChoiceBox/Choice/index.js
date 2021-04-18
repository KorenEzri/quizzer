import React from "react";

export default function Choice({ choice, isRight, index }) {
  return (
    <li
      key={`choice-${index}`}
      className="choicebox__choice"
      isright={`${isRight}`}
      onClick={({ target }) => {
        const isCorrect = target.getAttribute("isright");
      }}
    >
      <span key={`choice_span${index}`} className="choice__number">
        {index} -
      </span>
      {choice}
    </li>
  );
}
