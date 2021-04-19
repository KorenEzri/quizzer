import questionsAnswered from "./questionsAnswered";
import questionsFailed from "./questionsFailed";
import currentQuestion from "./currentQuestion";
import currentChoices from "./currentChoices";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  answered: questionsAnswered,
  failed: questionsFailed,
  question: currentQuestion,
  choices: currentChoices,
});

export default rootReducer;
