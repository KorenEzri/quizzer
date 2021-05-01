const setIsLogged = (isLogged) => {
  return {
    type: "SETISLOGGED",
    isLogged,
  };
};

export default setIsLogged;
