import React from "react";
import Choice from "./Choice";

const shuffleChoices = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

export default function ChoiceBox({ choices, questionType }) {
  const { rightChoice, falsies } = choices;
  if (!falsies) return null;
  const otherChoices = falsies.map((falseChoice) => {
    return falseChoice[questionType] || falseChoice;
  });
  const allChoices = shuffleChoices(otherChoices.concat(rightChoice));
  return (
    <div className="choiceBox-component">
      <ul>
        {questionType !== "truefalse" ? (
          allChoices.map((choice, index) => {
            let anyChoice = choice[questionType] || choice;
            return (
              <Choice
                key={`choice-${index}`}
                choice={anyChoice}
                isRight={
                  anyChoice === rightChoice[questionType] ||
                  anyChoice === rightChoice
                }
              />
            );
          })
        ) : (
          <div className="truefalse_div-choiceBox-component">
            <Choice
              key={"true"}
              choice={allChoices[0].country}
              isRight={allChoices[0].country === rightChoice}
            />
            <Choice
              key={"false"}
              choice={allChoices[1].country}
              isRight={allChoices[1].country === rightChoice}
            />
          </div>
        )}
      </ul>
    </div>
  );
}