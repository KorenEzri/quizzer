const initialState = {
  failedCount: 0,
};
const questionsFailed = (state = initialState, action) => {
  switch (action.type) {
    case "SETFAILCOUNT":
      return { failedCount: state.failedCount + 1 };
    case "EASYFAIL":
      return { failedCount: state.failedCount + 1 };
    case "MIDFAIL":
      return { failedCount: state.failedCount + 2 };
    case "HARDFAIL":
      return { failedCount: state.failedCount + 3 };
    default:
      return state;
  }
};

export default questionsFailed;
