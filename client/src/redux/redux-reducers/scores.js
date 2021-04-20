const scores = async (state = "", action) => {
  switch (action.type) {
    case "SETSCORES":
      return action.scores || "";
    default:
      return state;
  }
};

export default scores;
