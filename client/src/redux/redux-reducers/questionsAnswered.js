const initialState = {
  answerCount: 0,
};
const questionsAnswered = (state = initialState, action) => {
  switch (action.type) {
    case "SETANSWERCOUNT":
      return { answerCount: state.answerCount + 1 };
    default:
      return state;
  }
};

export default questionsAnswered;
