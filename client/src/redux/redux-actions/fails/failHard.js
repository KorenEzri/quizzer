const hardQuestionFailed = (amount) => {
  return {
    type: "HARDFAIL",
    amount,
  };
};

export default hardQuestionFailed;
