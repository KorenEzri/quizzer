import React from "react";
import { useSelector } from "react-redux";
import Choice from "./Choice";
import "./ChoiceBox.css";

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

export default function ChoiceBox({
  questionType,
  handleQuizStart,
  difficulty,
}) {
  const { choices } = useSelector((state) => state);
  const { rightChoice, falsies } = choices;
  if (!falsies) return null;

  const allChoices = Array.from(
    new Set(
      shuffleChoices(
        falsies
          .map((falseChoice) => {
            return falseChoice[questionType] || falseChoice;
          })
          .concat(rightChoice)
      )
    )
  );

  return (
    <div className="choiceBox-component">
      <ul className="choice__list">
        {questionType !== "truefalse" && rightChoice ? (
          allChoices.map((choice, index) => {
            let anyChoice = choice[questionType] || choice;
            return (
              <div className="choice__container">
                <Choice
                  choice={anyChoice}
                  isRight={
                    anyChoice === rightChoice[questionType] ||
                    anyChoice === rightChoice
                  }
                  index={index + 1}
                  handleQuizStart={handleQuizStart}
                  difficulty={difficulty}
                />
              </div>
            );
          })
        ) : (
          <div className="truefalse_div-choiceBox-component">
            <div className="choice__container">
              <Choice
                key={"true"}
                choice={allChoices[0].country}
                isRight={allChoices[0].country === rightChoice.country}
                difficulty={difficulty}
                handleQuizStart={handleQuizStart}
              />
            </div>
            <div className="choice__container">
              <Choice
                key={"false"}
                choice={allChoices[1].country}
                isRight={allChoices[1].country === rightChoice.country}
                difficulty={difficulty}
                handleQuizStart={handleQuizStart}
              />
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}
