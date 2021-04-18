const setQuestionsAnswered = (amount) => {
  return {
    type: "SETANSWERCOUNT",
    amount,
  };
};

export default setQuestionsAnswered;
