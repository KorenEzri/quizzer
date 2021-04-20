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
  if (!choices) return null;
  const allChoices = Array.from(
    new Set(
      shuffleChoices(
        choices.map((choice) => {
          return choice[questionType] || choice;
        })
      )
    )
  );

  return (
    <div className="choiceBox-component">
      <ul className="choice__list">
        {questionType !== "truefalse" ? (
          allChoices.map((choice, index) => {
            let anyChoice = choice[questionType] || choice;
            return (
              <div className="choice__container" key={`CBcontainer${index}`}>
                <Choice
                  choices={choices}
                  choice={anyChoice}
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
                choices={choices}
                choice={allChoices[0].country || allChoices[0]}
                difficulty={difficulty}
                handleQuizStart={handleQuizStart}
              />
            </div>
            <div className="choice__container">
              <Choice
                key={"false"}
                choices={choices}
                choice={allChoices[1].country || allChoices[1]}
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
