const Template = require("../sequelize/models/Template"); // QUESTION TEMPLATES
const Countries = require("../sequelize/models/Countries"); // COUNTRY DATA - RATES, REGIONS, ETC
const Population = require("../sequelize/models/Population"); // POPULATION COUNTS FOR COUNTRIES
const IndependeceDays = require("../sequelize/models/IndependenceDays"); // SELF EXPLANATORY
const CountryList = require("../sequelize/models/CountryList"); // SIMPLE LIST OF COUNTRIES THAT WORKS ACROSS ALL DATASETS
const Capitals = require("../sequelize/models/Capitals");
const { Sequelize } = require("sequelize");

/////////////////////////////////////
//  !!!!!!!     FLOW:     !!!!!!!
/////////////////////////////////////
// FUNC generateRandomQuestion() => gets random question template and random country names
const generateRandomQuestion = async () => {
  const allCountries = await CountryList.findAll({
    attributes: [Sequelize.fn("DISTINCT", Sequelize.col("Country")), "Country"],
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
  return {
    question: question,
    type: determineQuestionType(reqs, ans_type),
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
module.exports = { generateRandomQuestion };
