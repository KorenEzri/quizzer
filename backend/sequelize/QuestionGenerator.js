const Template = require("./models/Template"); // QUESTION TEMPLATES
const Countries = require("./models/Countries"); // COUNTRY DATA - RATES, REGIONS, ETC
const Population = require("./models/Population"); // POPULATION COUNTS FOR COUNTRIES
const IndependeceDays = require("./models/IndependenceDays"); // SELF EXPLANATORY
const CountryList = require("./models/CountryList"); // SIMPLE LIST OF COUNTRIES THAT WORKS ACROSS ALL DATASETS
const Capitals = require("./models/Capitals");
const { Sequelize } = require("sequelize");
const SendRating = require("./SendRating");
const QuestionSplitter = require("./QuestionSplitter");
/////////////////////////////////////
//  !!!!!!!     FLOW:     !!!!!!!
/////////////////////////////////////
let correctAnswer;
let currentQuestion;
let storageHasQuestions = true;
let round = 0;
let userScore = 0;

const deepEqual = (x, y) => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
};
const getQuestionFromDB = async (question) => {
  const choices = {
    falsies: [
      {
        country: question.choice_1_country,
        data: question.choice_1_data,
      },
      {
        country: question.choice_2_country,
        data: question.choice_2_data,
      },
      {
        country: question.choice_3_country,
        data: question.choice_3_data,
      },
    ],
    rightChoice: {
      country: question.choice_correct_country,
      data: question.choice_correct_data,
    },
  };
  correctAnswer = choices.rightChoice;
  currentQuestion = {
    question: question.question_full,
    choices,
    question_type: question.question_type,
  };
  const clientChoices = choices.falsies
    .concat([correctAnswer])
    .map((choice) => {
      if (choice.country == null) {
        return choice.data;
      } else {
        return choice;
      }
    });
  const clientQuestion = {
    question: question.question_full,
    choices: clientChoices,
    type: question.question_type,
  };
  return clientQuestion;
};
const generateQuestion = async () => {
  let questionForClient;
  let rawQuestion;
  if (!storageHasQuestions) {
    questionForClient = await generateRandomQuestion();
    console.log(
      "CORRECT: ",
      correctAnswer,
      "TYPE: ",
      currentQuestion.question_type
    );
    return questionForClient;
  }
  const {
    question,
    db,
  } = await QuestionSplitter.calculateChancesAndGetQuestion();
  if (question) {
    rawQuestion = question.question;
  }
  if (db) {
    questionForClient = await getQuestionFromDB(rawQuestion);
  } else {
    storageHasQuestions = false;
    questionForClient = await generateRandomQuestion();
  }
  console.log(
    "CORRECT: ",
    correctAnswer,
    "TYPE: ",
    currentQuestion.question_type
  );
  return questionForClient;
};
const checkIfCorrect = (answer, difficulty) => {
  let score = userScore;
  let decrement = 1;
  let increment = 1;
  if (difficulty > 2) {
    if (round > 2) {
      decrement = 3;
      increment = 2;
    }
  } else {
    round = 3;
  }
  if (difficulty > 3) {
    if (round > 3) {
      increment = 3;
    } else {
      round = 4;
    }
  }
  let isCorrect;
  if (!(answer instanceof Object)) {
    isCorrect = answer === correctAnswer || correctAnswer.data === answer;
  } else {
    isCorrect = deepEqual(answer, correctAnswer);
  }
  if (isCorrect) {
    userScore = score + increment;
  } else {
    userScore = score - decrement;
  }
  return isCorrect;
};
const initRatingSequence = async (score) => {
  if (!verifyScores(score)) {
    console.log("ERROR WITH VERIFY SCORE, score: ", score);
    return;
  }
  await SendRating.triggerRatingSequence(score);
};
const handleGameStart = async () => {
  QuestionSplitter.resetDataAtGameStart();
  SendRating.receieveRatingRequest(null, null, null, null, "gameEnd");
  userScore = 0;
  round = 0;
  correctAnswer = "";
  currentQuestion = "";
};
const verifyScores = (score) => {
  if (Math.abs(score - userScore) <= 5 || Math.abs(userScore - score) <= 5)
    return true;
  else {
    return false;
  }
};
const getFullQuestionForRating = () => {
  return currentQuestion;
};
// FUNC generateRandomQuestion() => gets random question template and random country names
const generateRandomQuestion = async () => {
  const allCountries = shuffleArray(
    await CountryList.findAll({
      attributes: [
        Sequelize.fn("DISTINCT", Sequelize.col("Country")),
        "Country",
      ],
    })
  );
  const templates = await Template.findAll();
  const randomTemplate = getRandomElements(templates, 1);
  const { template_reqs, template, template_ans_type } = randomTemplate[0];
  const questionBody = await getRelevantQuestionParams(
    template_reqs,
    template,
    allCountries,
    template_ans_type
  );
  currentQuestion = questionBody;
  correctAnswer = questionBody.choices.rightChoice;
  clientQuestion = {
    type: questionBody.question_type,
    question: questionBody.question,
    choices: questionBody.choices.falsies.concat([correctAnswer]),
  };
  return clientQuestion;
};
// calls FUNC getRelevantQuestionParams() => SWITCH case
// to determine question body + amount of countries in question
const getRelevantQuestionParams = async (reqs, template, list, ans_type) => {
  let question;
  let relevantCountries;
  switch (reqs) {
    case "list":
      relevantCountries = getRandomElements(list, 4);
      question = `${template}?`;
      break;
    case "XY":
      relevantCountries = getRandomElements(list, 2);
      question = template.replace(/X/g, relevantCountries[0].Country.trim());
      question = `${question.replace(
        /Y/g,
        relevantCountries[1].Country.trim()
      )}?`;
      break;
    case "X":
      relevantCountries = getRandomElements(list, 1);
      question = `${template.replace(
        /X/g,
        relevantCountries[0].Country.trim()
      )}?`;
      break;
    case "Xlist":
      relevantCountries = getRandomElements(list, 4);
      question = `${template.replace(
        /X/g,
        relevantCountries[0].Country.trim()
      )}?`;
      break;
    default:
      relevantCountries = getRandomElements(list, 1);
      question = `${template}${relevantCountries[0].Country.trim()}?`;
      break;
  }
  const questionChoices = await getRelevantQuestionChoices(
    ans_type,
    relevantCountries
  );
  if (!questionChoices.rightChoice) {
    return await getRelevantQuestionParams();
  }
  return {
    question: question,
    question_type: determineQuestionType(reqs, ans_type),
    choices: questionChoices,
  };
};
// calls FUNC getRelevantQuestionChoices() => SWITCH case
// to determine what data to get for QUESTION CHOICES = QC
const getRelevantQuestionChoices = async (ans_type, countries) => {
  switch (ans_type) {
    case "pop_count":
      return await getPopulationQCs(countries);
    case "size":
      return await getSizeQCs(countries);
    case "aut_date":
      return await getAut_DateQCs(countries);
    case "birthrate":
      return await getRateQCs(countries, "Birthrate");
    case "deathrate":
      return await getRateQCs(countries, "Deathrate");
    case "capital":
      return await getCapitalQCs(countries);
    case "region":
      return await getRegionalQCs(countries);
    case "continent":
      return await getContinentQCs(countries);
    default:
      break;
  }
};
// calls DATA-GETTERS: FOR QUESTION CHOICES
const getPopulationQCs = async (countries) => {
  const popsByCountries = await Promise.all(
    countries.map(async ({ Country }) => {
      const popCount = await Population.findAll({
        attributes: [
          Sequelize.fn("DISTINCT", Sequelize.col("Population")),
          "Population",
        ],
        where: {
          Country: `${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        data: popCount[0].dataValues.Population,
      };
    })
  );
  return generateNumericChoices(popsByCountries);
};
const getSizeQCs = async (countries) => {
  const countrySizeInSqKm = await Promise.all(
    countries.map(async ({ Country }) => {
      const CountrySize = await Countries.findAll({
        attributes: [
          Sequelize.fn("DISTINCT", Sequelize.col("Area_sq_mi")),
          "Area_sq_mi",
        ],
        where: {
          Country: `${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        data: CountrySize[0].dataValues.Area_sq_mi,
      };
    })
  );
  return generateNumericChoices(countrySizeInSqKm);
};
const getRateQCs = async (countries, birthOrDeath) => {
  const ratesByCountry = await Promise.all(
    countries.map(async ({ Country }) => {
      const birthOrDeathRate = await Countries.findAll({
        attributes: [
          Sequelize.fn("DISTINCT", Sequelize.col(`${birthOrDeath}`)),
          `${birthOrDeath}`,
        ],
        where: {
          Country: `${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        data: birthOrDeathRate[0].dataValues[birthOrDeath],
      };
    })
  );
  return generateNumericChoices(ratesByCountry);
};
const getAut_DateQCs = async (countries) => {
  const independenceDaysByCountry = await Promise.all(
    countries.map(async ({ Country }) => {
      const independeceDays = await IndependeceDays.findAll({
        attributes: [
          Sequelize.fn("DISTINCT", Sequelize.col("Year_celebrated")),
          "Year_celebrated",
        ],
        where: {
          Country: ` ${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        data: independeceDays[0].dataValues.Year_celebrated,
      };
    })
  );
  return generateTextualChoices(independenceDaysByCountry);
};
const getCapitalQCs = async (countries) => {
  const capitalsByCountry = await Promise.all(
    countries.map(async ({ Country }) => {
      const capitals = await Capitals.findAll({
        attributes: [
          Sequelize.fn("DISTINCT", Sequelize.col("CapitalName")),
          "CapitalName",
        ],
        where: {
          Country: `${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        data: capitals[0].dataValues.CapitalName,
      };
    })
  );
  return generateTextualChoices(capitalsByCountry);
};
const getRegionalQCs = async (countries) => {
  const regionsByCountry = await Promise.all(
    countries.map(async ({ Country }) => {
      const regions = await Countries.findAll({
        attributes: [
          Sequelize.fn("DISTINCT", Sequelize.col("Region")),
          "Region",
        ],
        where: {
          Country: `${Country.trim()}`,
        },
      });
      const region_name = regions[0].dataValues.Region;
      const lower = region_name.toLowerCase();
      return {
        country: Country.trim(),
        data: region_name.charAt(0).toUpperCase() + lower.slice(1).trim(),
      };
    })
  );
  return generateTextualChoices(regionsByCountry);
};
const getContinentQCs = async (countries) => {
  const continentsByCountry = await Promise.all(
    countries.map(async ({ Country }) => {
      const continents = await Capitals.findAll({
        attributes: [
          Sequelize.fn("DISTINCT", Sequelize.col("ContinentName")),
          "ContinentName",
        ],
        where: {
          Country: `${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        data: continents[0].dataValues.ContinentName,
      };
    })
  );
  return generateTextualChoices(continentsByCountry);
};
// DATA-GETTERS END
// FUNC generateNumericChoices() || generateTextualChoices() => accepts array of answers,
// gets the correct answer from array
const generateNumericChoices = (numByCountries) => {
  let falsies;
  let rightChoice;
  if (numByCountries.length > 1) {
    let choiceValues = numByCountries.map((choice) => {
      return choice.data;
    });
    rightChoice = numByCountries.find((choice) => {
      return choice.data === Math.max(...choiceValues);
    });
    numByCountries.splice(
      numByCountries.findIndex((choice) => {
        return choice.data === rightChoice.data;
      }),
      1
    );
    numByCountries[0].size
      ? (falsies = getChoicesRelativeToNumber(numByCountries[0].data))
      : (falsies = numByCountries);
  } else {
    rightChoice = numByCountries[0].data;
    falsies = getChoicesRelativeToNumber(rightChoice);
  }
  return {
    rightChoice,
    falsies,
  };
};
const generateTextualChoices = (stringsByCountries) => {
  let falsies;
  let rightChoice;
  if (!Number(stringsByCountries[0].data)) {
    rightChoice = stringsByCountries[0].data;
    stringsByCountries.splice(0, 1);
    falsies = stringsByCountries;
    return {
      rightChoice,
      falsies,
    };
  }
  let choiceValues = stringsByCountries.map((choice) => {
    return Number(choice.data);
  });
  rightChoice = stringsByCountries.find((choice) => {
    return Number(choice.data) === Math.min(...choiceValues);
  });
  stringsByCountries.splice(
    stringsByCountries.findIndex((choice) => {
      return Number(choice.data) === Number(rightChoice.data);
    }),
    1
  );
  falsies = stringsByCountries;
  return {
    rightChoice,
    falsies,
  };
};
// FUNC getChoicesRelativeToNumber() => accepts number, returns array
// of related numbers: One close, one ridiculously far, and one random.
const getChoicesRelativeToNumber = (n, difficulty) => {
  return [
    Math.floor(n / 1.1),
    Math.floor(n / 0.01),
    Math.floor(n / Math.random()),
  ];
};
// FUNC getRandomElements() receives an array and Number n, returns n random elements
const getRandomElements = (array, n) => {
  let count = 0;
  let results = [];
  while (count < n) {
    results.push(array[Math.floor(Math.random() * array.length)].dataValues);
    count++;
  }
  return results;
};
// FUNC determineQuestionType() receives question requirements and answer type
// and determines then returns the type of answer to offer the user.
const determineQuestionType = (reqs, ans_type) => {
  const type = `${reqs}${ans_type}`;
  if (reqs === "XY") {
    return "truefalse";
  }
  if (type === "listaut_date" || "listdeathrate" || "listpop_count") {
    return "country";
  } else {
    return "data";
  }
};
const shuffleArray = (array) => {
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
module.exports = {
  generateQuestion,
  checkIfCorrect,
  verifyScores,
  getFullQuestionForRating,
  handleGameStart,
  initRatingSequence,
};
