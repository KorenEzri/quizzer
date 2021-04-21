const SavedQuestions = require("./models/SavedQuestions");
let questions;
let totalAmountOfSavedQuestions = 0;
let totalQuestionsAvailable = 0;
let spentQuestions = [];
let round = 0;
/////////////////////////////////////
//  !!!!!!!     FLOW:     !!!!!!!
/////////////////////////////////////

// FUNC calculateChancesAndGetQuestion() - CALCS CHANCES OF DB QUESTION AND TRIGGERS
// getQuestionFromDBstore() IF DB QUESTION CHANCE APPLIES
// CALLS calculateInitialData() FIRST TO SET UP THE DATA CALCULATIONS ARE BASED ON
const calculateChancesAndGetQuestion = async () => {
  await calculateInitialData(round);
  let random = Math.random() * 100;
  let chance;
  if ((totalQuestionsAvailable = 0)) {
    chance = "!";
  }
  if (totalQuestionsAvailable < 100) {
    chance = totalQuestionsAvailable * 0.06 + 0.1;
  }
  if (totalQuestionsAvailable >= 100) {
    chance = 70;
  }
  chance = 101;
  if (random < chance && chance != "!" && totalQuestionsAvailable > 0) {
    return getQuestionFromDBstore();
  } else {
    return "!";
  }
};
// FUNC calculateInitialData() AS MENTIONED ABOVE
const calculateInitialData = async (round) => {
  if (round === 0) {
    questions = (await SavedQuestions.findAll({})).map((question, index) => {
      const { dataValues } = question;
      return {
        question: dataValues,
        index,
      };
    });
    totalAmountOfSavedQuestions = questions.length;
    totalQuestionsAvailable = totalAmountOfSavedQuestions;
    round++;
  } else return;
};
// FUNC getQuestionFromDBstore() GETS QUESTION FROM DATABASE, RETURNS {db: true, question }
// MAKES SURE QUESTION IS NOT REPEATED - REMOVES CHOSEN QUESTION FROM TEMPORARY STORAGE
const getQuestionFromDBstore = () => {
  console.log("getting question from storage.. ");
  let question = getRandomElements(questions, 1)[0];
  questions.splice(question.index);
  console.log("questions left in store: ", questions.length);
  return { db: true, question };
};
// RESETS THE DATA FUNCTION calculateInitialData() SETS UP AT THE BEGINNING OF A GAME
const resetDataAtGameStart = () => {
  totalAmountOfSavedQuestions = 0;
  totalQuestionsAvailable = 0;
  spentQuestions = [];
  round = 0;
  questions = "";
  console.log("Initial DBquestions datavalues cleared!");
};
// GETS A RANDOM ELEMENT FROM AN ARRAY.
const getRandomElements = (array, n) => {
  let count = 0;
  let results = [];
  while (count < n) {
    results.push(array[Math.floor(Math.random() * array.length)]);
    count++;
  }
  return results;
};
module.exports = { calculateChancesAndGetQuestion, resetDataAtGameStart };
