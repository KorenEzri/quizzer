import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useState } from "react";

export default function PrivateRoute({ component, path, exact }) {
  const validateCookie = (document.cookie.match(
    /^(?:.*;)?\s*loggedIn\s*=\s*([^;]+)(?:.*)?$/
  ) || [, null])[1];
  const [isValidated, setIsValidated] = useState(validateCookie);

  const validateCookies = async () => {
    if (isValidated === null) return false;
    try {
      // setIsValidated(checkCookies);
    } catch ({ message }) {
      console.log(message);
    }
  };

  setTimeout(() => {
    validateCookies();
  }, 600);

  return isValidated ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to="/login" />
  );
}
