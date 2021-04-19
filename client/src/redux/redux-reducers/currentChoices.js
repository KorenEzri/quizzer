const currentChoices = (state = "", action) => {
  switch (action.type) {
    case "SETCHOICES":
      return action.choices || "";
    default:
      return state;
  }
};

export default currentChoices;
