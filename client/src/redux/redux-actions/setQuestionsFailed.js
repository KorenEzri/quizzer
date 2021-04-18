const setQuestionsFailed = (amount) => {
  return {
    type: "SETFAILCOUNT",
    amount,
  };
};

export default setQuestionsFailed;
