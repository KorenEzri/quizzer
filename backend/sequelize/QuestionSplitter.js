const SavedQuestions = require("./models/SavedQuestions");
let questions;
let totalAmountOfSavedQuestions = 0;
let totalQuestionsAvailable = 0;
let allQuestionRatingsCombined = 0;
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
  if (totalQuestionsAvailable === 0) {
    chance = "!";
  }
  if (totalQuestionsAvailable < 100) {
    chance = totalQuestionsAvailable * 0.06 + 0.1;
  }
  if (totalQuestionsAvailable >= 100) {
    chance = 70;
  }
  chance = 101;
  if (random < chance && chance !== "!" && totalQuestionsAvailable > 0) {
    return getQuestionFromDBstore();
  } else {
    return "!";
  }
};
// FUNC calculateInitialData() AS MENTIONED ABOVE
const calculateInitialData = async () => {
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
  allQuestionRatingsCombined = questions.reduce((prev, cur) => {
    return prev + Number(cur.question.final_score);
  }, 0);
  assignChanceToEachElement(
    questions,
    "final_score",
    allQuestionRatingsCombined,
    "question"
  );
  let question = calculateOddsAndGetElement(questions, "chance");
  questions = questions.filter((item) => item.index !== question.index);
  console.log("questions left in store: ", questions.length);
  if (question) {
    return { db: true, question };
  } else if (questions.length === 0) {
    return { db: false };
  }
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
// SELF EXPLANATORY FUNCTIONS.

const assignChanceToEachElement = (
  array,
  relativeProperty,
  totalDelimiter,
  accessorProperty
) => {
  array.forEach((item) => {
    const chance =
      (item[accessorProperty][relativeProperty] / totalDelimiter) * 100;
    item.chance = chance;
    console.log("ITEM: ", item);
  });
};
const getRandomElements = (array, n) => {
  let count = 0;
  let results = [];
  while (count < n) {
    results.push(array[Math.floor(Math.random() * array.length)]);
    count++;
  }
  return results[0];
};
const calculateOddsAndGetElement = (array, chanceProperty) => {
  const maxChance = Math.ceil(
    Math.max.apply(
      Math,
      array.map(function (o) {
        return o[chanceProperty];
      })
    ) / 10
  );
  const minChance = Math.ceil(
    Math.min.apply(
      Math,
      array.map(function (o) {
        return o[chanceProperty];
      })
    ) / 10
  );
  console.log("MINCHANCE: ", minChance, "maxChanc:", maxChance);
  let chancedQuestions;
  const random =
    Math.floor(Math.random() * (maxChance - minChance + 1) + minChance) * 10;
  switch (random) {
    case 10:
      console.log("CHANCE 10");
      chancedQuestions = array.filter((item) => item[chanceProperty] < random);
      return getRandomElements(chancedQuestions, 1);
    case 20:
      console.log("CHANCE 20");
      chancedQuestions = array.filter(
        (item) => item[chanceProperty] <= random && item[chanceProperty] > 10
      );
      return getRandomElements(chancedQuestions, 1);
    case 30:
      console.log("CHANCE 30");
      chancedQuestions = array.filter(
        (item) => item[chanceProperty] <= random && item[chanceProperty] > 20
      );
      return getRandomElements(chancedQuestions, 1);
    case 40:
      console.log("CHANCE 40");
      chancedQuestions = array.filter(
        (item) => item[chanceProperty] <= random && item[chanceProperty] > 30
      );
      return getRandomElements(chancedQuestions, 1);
    case 50:
      console.log("CHANCE 50");
      chancedQuestions = array.filter((item) => {
        return item[chanceProperty] <= random && item[chanceProperty] > 40;
      });
      return getRandomElements(chancedQuestions, 1);
    case 60:
      console.log("CHANCE 60");
      chancedQuestions = array.filter(
        (item) => item[chanceProperty] <= random && item[chanceProperty] > 50
      );
      return getRandomElements(chancedQuestions, 1);
    case 70:
      console.log("CHANCE 70");
      chancedQuestions = array.filter(
        (item) => item[chanceProperty] <= random && item[chanceProperty] > 60
      );
      return getRandomElements(chancedQuestions, 1);
    case 80:
      console.log("CHANCE 80");
      chancedQuestions = array.filter(
        (item) => item[chanceProperty] <= random && item[chanceProperty] > 70
      );
      return getRandomElements(chancedQuestions, 1);
    case 90:
      console.log("CHANCE 90");
      chancedQuestions = array.filter(
        (item) => item[chanceProperty] <= random && item[chanceProperty] > 80
      );
      return getRandomElements(chancedQuestions, 1);
    default:
      console.log("CHANCE > 90");
      if (array.length === 1) {
        return array[0];
      }
      chancedQuestions = array.filter((item) => {
        return item[chanceProperty] < -random && item[chanceProperty > 90];
      });
      return getRandomElements(chancedQuestions, 1);
  }
};
module.exports = { calculateChancesAndGetQuestion, resetDataAtGameStart };
