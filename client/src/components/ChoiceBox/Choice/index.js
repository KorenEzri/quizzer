import React from "react";

export default function Choice({ choice, isRight }) {
  return (
    <li className="choicebox__choice" isright={`${isRight}`}>
      {choice}
    </li>
  );
}
