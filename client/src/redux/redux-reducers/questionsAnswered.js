const questionsAnswered = (state = 0, action) => {
  switch (action.type) {
    case "SETANSWERCOUNT":
      const count = action.amount;
      return count;
    default:
      return state;
  }
};

export default questionsAnswered;
