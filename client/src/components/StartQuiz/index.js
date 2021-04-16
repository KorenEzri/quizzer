import React from "react";

export default function StartQuiz({ handleQuizStart }) {
  return (
    <div className="start-quiz-component">
      <button
        onClick={() => {
          handleQuizStart();
        }}
      >
        Start
      </button>
    </div>
  );
}
