import questionsAnswered from "./questionsAnswered";
import questionsFailed from "./questionsFailed";
import currentQuestion from "./currentQuestion";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  answered: questionsAnswered,
  failed: questionsFailed,
  question: currentQuestion,
});

export default rootReducer;
