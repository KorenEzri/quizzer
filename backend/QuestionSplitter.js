const sequelize = require("./sequelize");
const DataTypes = require("sequelize/lib/data-types");
const questions = require("./models/questions")(sequelize, DataTypes);
let savedQuestions;
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

  if (savedQuestions.length) totalQuestionsAvailable = savedQuestions.length;
  if (totalQuestionsAvailable === 0) {
    console.log("no questions in storage");
    chance = "!";
  }
  if (totalQuestionsAvailable < 100) {
    chance = (totalQuestionsAvailable * 0.06 + 0.1) * 10;
    console.log("less than 100 questions left in storage");
  }
  if (totalQuestionsAvailable >= 100) {
    console.log("over 100 questions in storage!");
    chance = 70;
  }
  if (random < chance && chance !== "!" && totalQuestionsAvailable > 0) {
    return getQuestionFromDBstore();
  } else {
    return "!";
  }
};
// FUNC calculateInitialData() AS MENTIONED ABOVE
const calculateInitialData = async () => {
  if (round === 0) {
    savedQuestions = (await questions.findAll({})).map((question, index) => {
      const { dataValues } = question;
      return {
        question: dataValues,
        index,
      };
    });
    totalAmountOfSavedQuestions = savedQuestions.length;
    totalQuestionsAvailable = totalAmountOfSavedQuestions;
    round++;
  } else return;
};
// FUNC getQuestionFromDBstore() GETS QUESTION FROM DATABASE, RETURNS {db: true, question }
// MAKES SURE QUESTION IS NOT REPEATED - REMOVES CHOSEN QUESTION FROM TEMPORARY STORAGE
const getQuestionFromDBstore = () => {
  console.log("getting question from storage.. ");
  allQuestionRatingsCombined = savedQuestions.reduce((prev, cur) => {
    return prev + Number(cur.question.finalScore);
  }, 0);
  assignChanceToEachElement(
    savedQuestions,
    "finalScore",
    allQuestionRatingsCombined,
    "question"
  );
  let question = calculateOddsAndGetElement(savedQuestions, "chance");
  if (!question) {
    question = calculateOddsAndGetElement(savedQuestions, "chance");
  }
  savedQuestions = savedQuestions.filter(
    (item) => item.index !== question.index
  );
  console.log("questions left in store: ", savedQuestions.length);
  if (question) {
    return { db: true, question };
  } else if (savedQuestions.length === 0) {
    return { db: "empty" };
  }
};
// RESETS THE DATA FUNCTION calculateInitialData() SETS UP AT THE BEGINNING OF A GAME
const resetDataAtGameStart = async () => {
  totalAmountOfSavedQuestions = 0;
  totalQuestionsAvailable = 0;
  allQuestionRatingsCombined = 0;
  round = 0;
  savedQuestions = "";
  await calculateInitialData();
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
  let chancedQuestions;
  const random = Math.floor(
    Math.random() * (maxChance - minChance + 1) + minChance
  );
  if (random < 5) {
    // 50% chance
    chancedQuestions = array.filter((item) => item[chanceProperty] <= 50);
    return getRandomElements(chancedQuestions, 1);
  } else if (random < 7) {
    // 20% chance
    chancedQuestions = array.filter((item) => item[chanceProperty] <= 20);
    return getRandomElements(chancedQuestions, 1);
  } else if (random < 10) {
    // 30% chance
    chancedQuestions = array.filter((item) => item[chanceProperty] <= 30);
    return getRandomElements(chancedQuestions, 1);
  } else {
    chancedQuestions = array.filter((item) => item[chanceProperty] > 90);
    return getRandomElements(chancedQuestions, 1);
  }

  // const random = Math.floor(Math.random() * (10 - 1 + 1) + minChance) * 10;
  // switch (random) {
  //   case 10:
  //     console.log("CHANCE 10");
  //     chancedQuestions = array.filter((item) => item[chanceProperty] < random);
  //     return getRandomElements(chancedQuestions, 1);
  //   case 20:
  //     console.log("CHANCE 20");
  // chancedQuestions = array.filter(
  //   (item) => item[chanceProperty] <= random && item[chanceProperty] > 10
  // );
  // return getRandomElements(chancedQuestions, 1);
  //   case 30:
  //     console.log("CHANCE 30");
  //     chancedQuestions = array.filter(
  //       (item) => item[chanceProperty] <= random && item[chanceProperty] > 20
  //     );
  //     return getRandomElements(chancedQuestions, 1);
  //   case 40:
  //     console.log("CHANCE 40");
  //     chancedQuestions = array.filter(
  //       (item) => item[chanceProperty] <= random && item[chanceProperty] > 30
  //     );
  //     return getRandomElements(chancedQuestions, 1);
  //   case 50:
  //     console.log("CHANCE 50");
  //     chancedQuestions = array.filter((item) => {
  //       return item[chanceProperty] <= random && item[chanceProperty] > 40;
  //     });
  //     return getRandomElements(chancedQuestions, 1);
  //   case 60:
  //     console.log("CHANCE 60");
  //     chancedQuestions = array.filter(
  //       (item) => item[chanceProperty] <= random && item[chanceProperty] > 50
  //     );
  //     return getRandomElements(chancedQuestions, 1);
  //   case 70:
  //     console.log("CHANCE 70");
  //     chancedQuestions = array.filter(
  //       (item) => item[chanceProperty] <= random && item[chanceProperty] > 60
  //     );
  //     return getRandomElements(chancedQuestions, 1);
  //   case 80:
  //     console.log("CHANCE 80");
  //     chancedQuestions = array.filter(
  //       (item) => item[chanceProperty] <= random && item[chanceProperty] > 70
  //     );
  //     return getRandomElements(chancedQuestions, 1);
  //   case 90:
  //     console.log("CHANCE 90");
  //     chancedQuestions = array.filter(
  //       (item) => item[chanceProperty] <= random && item[chanceProperty] > 80
  //     );
  //     return getRandomElements(chancedQuestions, 1);
  //   default:
  //     console.log("CHANCE > 90");
  //     if (array.length === 1) {
  //       return array[0];
  //     }
  //     chancedQuestions = array.filter((item) => {
  //       return item[chanceProperty] < -random && item[chanceProperty > 90];
  //     });
  //     return getRandomElements(chancedQuestions, 1);
  // }
};
module.exports = { calculateChancesAndGetQuestion, resetDataAtGameStart };
