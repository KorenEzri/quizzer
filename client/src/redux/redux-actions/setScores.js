const setScores = (scores) => {
  return {
    type: "SETSCORES",
    scores,
  };
};

export default setScores;
