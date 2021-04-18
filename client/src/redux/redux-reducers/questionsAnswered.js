const initialState = {
  answerCount: 0,
};
const questionsAnswered = (state = initialState, action) => {
  switch (action.type) {
    case "SETANSWERCOUNT":
      return { answerCount: state.answerCount + 1 };
    case "EASYANS":
      return { answerCount: state.answerCount + 1 };
    case "MIDANS":
      return { answerCount: state.answerCount + 2 };
    case "HARDANS":
      return { answerCount: state.answerCount + 3 };
    default:
      return state;
  }
};

export default questionsAnswered;
