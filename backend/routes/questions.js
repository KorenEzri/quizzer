const { Router } = require("express");
const Template = require("../sequelize/models/Template");
const Countries = require("../sequelize/models/Countries");
const Population = require("../sequelize/models/Population");
const IndependeceDays = require("../sequelize/models/IndependenceDays");
const CountryList = require("../sequelize/models/CountryList");
const questions = Router();
const DBconnection = require(".././sequelize/sequelize");

const generateNumericChoices = (numByCountries) => {
  let falsies;
  let rightChoice;
  if (numByCountries.length > 1) {
    let choiceValues = numByCountries.map((choice) => {
      return choice.population || choice.size || choice.rate;
    });
    rightChoice = numByCountries.find((choice) => {
      return (
        choice.population ||
        choice.size ||
        choice.rate === Math.max(...choiceValues)
      );
    });
    numByCountries.splice(
      numByCountries.findIndex((choice) => {
        return (
          choice.population ||
          choice.size ||
          choice.rate === rightChoice.population
        );
      }),
      1
    );
    numByCountries[0].size
      ? (falsies = fabricateChoicesFromNumber(numByCountries[0].size))
      : (falsies = numByCountries);
  } else {
    rightChoice =
      numByCountries[0].population ||
      numByCountries[0].size ||
      numByCountries[0].rate;
    falsies = fabricateChoicesFromNumber(rightChoice);
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
      return Number(choice.autonomyDate) !== rightChoice.autonomyDate;
    }),
    1
  );
  falsies = datesByCountries;
  return {
    rightChoice,
    falsies,
  };
};
const fabricateChoicesFromNumber = (n, difficulty) => {
  return [
    Math.floor(n / 1.1),
    Math.floor(n / 0.01),
    Math.floor(n / Math.random()),
  ];
};
const getRandomElements = (array, n) => {
  let count = 0;
  let results = [];
  while (count < n) {
    results.push(array[Math.floor(Math.random() * array.length)].dataValues);
    count++;
  }
  return results;
};
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
  return generateNumericChoices(popsByCountries);
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
  return generateNumericChoices(countrySizeInSqKm);
};
const getRateQCs = async (countries, birthOrDeath) => {
  const rate = await Promise.all(
    countries.map(async ({ Country }) => {
      const CountrySize = await Countries.findAll({
        attributes: [`${birthOrDeath}`],
        where: {
          Country: `${Country.trim()}`,
        },
      });
      return {
        country: Country.trim(),
        rate:
          CountrySize[0].dataValues.birthrate ||
          CountrySize[0].dataValues.deathrate,
      };
    })
  );
  return generateNumericChoices(rate);
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
const getRelevantQuestionChoices = async (ans_type, countries) => {
  switch (ans_type) {
    case "pop_count":
      return await getPopulationQCs(countries);
    case "size":
      return await getSizeQCs(countries);
    case "aut_date":
      return await getAut_DateQCs(countries);
    case "birthrate":
      return await getRateQCs(countries, "birthrate");
    default:
      break;
  }
};
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

questions.get("/question", async (req, res) => {
  try {
    res.status(200).send(await generateRandomQuestion());
  } catch ({ message }) {
    try {
      res.status(200).send(await generateRandomQuestion());
    } catch ({ message }) {
      console.log(message);
      res.status(500).json({
        message: `There was a problem processing the request, ${message}`,
      });
    }
  }
});

module.exports = questions;
