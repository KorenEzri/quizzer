const easyQuestionFailed = (amount) => {
  return {
    type: "EASYFAIL",
    amount,
  };
};

export default easyQuestionFailed;
