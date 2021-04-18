const currentQuestion = (state = "", action) => {
  switch (action.type) {
    case "SETQUESTION":
      return action.question || "";
    default:
      return state;
  }
};

export default currentQuestion;
