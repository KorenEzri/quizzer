const setCurrentChoices = (choices) => {
  return {
    type: "SETCHOICES",
    choices,
  };
};

export default setCurrentChoices;
