import React from "react";
import "./Question.css";
export default function Question({ question }) {
  return (
    <div className="question-component">
      {question.countryList ? (
        <div className="question">{`${question.template}?`}</div>
      ) : (
        <div className="question">{question}</div>
      )}
    </div>
  );
}
