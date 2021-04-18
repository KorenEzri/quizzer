const midQuestionFailed = (amount) => {
  return {
    type: "MIDFAIL",
    amount,
  };
};

export default midQuestionFailed;
