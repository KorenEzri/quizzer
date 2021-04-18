const questionsFailed = (state = 0, action) => {
  switch (action.type) {
    case "SETFAILCOUNT":
      const count = action.amount;
      return count;
    default:
      return state;
  }
};

export default questionsFailed;
