const initialState = {
  failedCount: 0,
};
const questionsFailed = (state = initialState, action) => {
  switch (action.type) {
    case "SETFAILCOUNT":
      return { failedCount: state.failedCount + 1 };
    default:
      return state;
  }
};

export default questionsFailed;
