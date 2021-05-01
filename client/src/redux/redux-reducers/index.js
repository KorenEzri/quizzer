import questionsAnswered from "./questionsAnswered";
import questionsFailed from "./questionsFailed";
import currentQuestion from "./currentQuestion";
import currentChoices from "./currentChoices";
import isLogged from "./isLogged";
import scores from "./scores";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  answered: questionsAnswered,
  failed: questionsFailed,
  question: currentQuestion,
  choices: currentChoices,
  scores: scores,
  isLogged,
});

export default rootReducer;
