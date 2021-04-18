import React from "react";

export default function Choice({ choice, isRight }) {
  console.log(choice, isRight);
  return <li>{choice}</li>;
}
