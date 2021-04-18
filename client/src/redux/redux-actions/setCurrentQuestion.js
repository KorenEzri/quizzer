const setCurrentQuestion = (question) => {
  return {
    type: "SETQUESTION",
    question,
  };
};

export default setCurrentQuestion;
