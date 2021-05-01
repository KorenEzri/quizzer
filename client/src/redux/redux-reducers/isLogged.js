const isLogged = (state = false, action) => {
  switch (action.type) {
    case "SETISLOGGED":
      return !state;
    default:
      return state;
  }
};

export default isLogged;
