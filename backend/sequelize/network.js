const Template = require("../sequelize/models/Template"); // QUESTION TEMPLATES
const Countries = require("../sequelize/models/Countries"); // COUNTRY DATA - RATES, REGIONS, ETC
const Population = require("../sequelize/models/Population"); // POPULATION COUNTS FOR COUNTRIES
const IndependeceDays = require("../sequelize/models/IndependenceDays"); // SELF EXPLANATORY
const CountryList = require("../sequelize/models/CountryList"); // SIMPLE LIST OF COUNTRIES THAT WORKS ACROSS ALL DATASETS

/////////////////////////////////////
//  !!!!!!!     FLOW:     !!!!!!!
/////////////////////////////////////

// FUNC generateRandomQuestion() => gets random question template and random country names
const generateRandomQuestion = async () => {
  const allCountries = await CountryList.findAll({
    attributes: ["Country"],
  });
  const templates = await Template.findAll();
  const randomTemplate = getRandomElements(templates, 1);
  const { template_reqs, template, template_ans_type } = randomTemplate[0];
  const questionBody = getRelevantQuestionParams(
    template_reqs,
    template,
    allCountries,
    template_ans_type
  );
  return questionBody;
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
    default:
      relevantCountries = getRandomElements(list, 1);
      question = `${template}${relevantCountries[0].Country.trim()}?`;
      break;
  }
  const questionChoices = await getRelevantQuestionChoices(
    ans_type,
    relevantCountries
  );
  return {
    question: question,
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
    default:
      break;
  }
};

// calls DATA-GETTERS: FOR QUESTION CHOICES
const getPopulationQCs = async (countries) => {
  const popsByCountries = await Promise.all(
    countries.map(async ({ Country }) => {
      const popCount = await Population.findAll({
        attributes: ["Population"],
        where: {
          Country: `${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        population: popCount[0].dataValues.Population,
      };
    })
  );
  return generateNumericChoices(popsByCountries, "population");
};
const getSizeQCs = async (countries) => {
  const countrySizeInSqKm = await Promise.all(
    countries.map(async ({ Country }) => {
      const CountrySize = await Countries.findAll({
        attributes: ["Area_sq_mi"],
        where: {
          Country: `${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        size: CountrySize[0].dataValues.Area_sq_mi,
      };
    })
  );
  return generateNumericChoices(countrySizeInSqKm, "size");
};
const getRateQCs = async (countries, birthOrDeath) => {
  const { Country } = countries[0];
  const birthOrDeathRate = await Countries.findAll({
    attributes: [`${birthOrDeath}`],
    where: {
      Country: `${Country.trim()}`,
    },
  });
  const rate = {
    country: Country,
    rate: birthOrDeathRate[0].dataValues[birthOrDeath],
  };
  return generateNumericChoices([rate], "rate");
};
const getAut_DateQCs = async (countries) => {
  const independenceDaysByCountry = await Promise.all(
    countries.map(async ({ Country }) => {
      const independeceDays = await IndependeceDays.findAll({
        attributes: ["Year_celebrated"],
        where: {
          Country: ` ${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        autonomyDate: independeceDays[0].dataValues.Year_celebrated,
      };
    })
  );
  return generateDateChoices(independenceDaysByCountry);
};
// DATA-GETTERS END

// FUNC generateNumericChoices() || generateDateChoices() => accepts array of answers,
// gets the correct answer from array
const generateNumericChoices = (numByCountries, type) => {
  let falsies;
  let rightChoice;
  if (numByCountries.length > 1) {
    let choiceValues = numByCountries.map((choice) => {
      return choice[type];
    });
    rightChoice = numByCountries.find((choice) => {
      return choice[type] === Math.max(...choiceValues);
    });
    numByCountries.splice(
      numByCountries.findIndex((choice) => {
        return choice[type] === rightChoice[type];
      }),
      1
    );
    numByCountries[0].size
      ? (falsies = getChoicesRelativeToNumber(numByCountries[0].size))
      : (falsies = numByCountries);
  } else {
    rightChoice = numByCountries[0][type];
    falsies = getChoicesRelativeToNumber(rightChoice);
  }
  return {
    rightChoice,
    falsies,
  };
};
const generateDateChoices = (datesByCountries) => {
  let falsies;
  let rightChoice;
  let choiceValues = datesByCountries.map((choice) => {
    return Number(choice.autonomyDate);
  });
  rightChoice = datesByCountries.find((choice) => {
    return Number(choice.autonomyDate) === Math.min(...choiceValues);
  });
  datesByCountries.splice(
    datesByCountries.findIndex((choice) => {
      return Number(choice.autonomyDate) === Number(rightChoice.autonomyDate);
    }),
    1
  );
  falsies = datesByCountries;
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

module.exports = { generateRandomQuestion };
