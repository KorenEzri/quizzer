import React from "react";

export default function StartQuiz({ handleQuizStart }) {
  return (
    <div className="start-quiz-component">
      <button
        onClick={async () => {
          await handleQuizStart();
        }}
      >
        Start
      </button>
    </div>
  );
}
