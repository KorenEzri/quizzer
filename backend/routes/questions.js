const { Router } = require("express");
const Template = require("../sequelize/models/Template");
const Countries = require("../sequelize/models/Countries");
const questions = Router();
const DBconnection = require(".././sequelize/sequelize");

const getRandomElements = (array, n) => {
  let count = 0;
  let results = [];
  while (count < n) {
    results.push(array[Math.floor(Math.random() * array.length)]);
    count++;
  }
  return results;
};
const getRelevantQuestionParams = (reqs, template, list) => {
  let countryList;
  let question;
  switch (reqs) {
    case "list":
      countryList = getRandomElements(list, 4);
      return template;
    case "XY":
      countryList = getRandomElements(list, 2);
      question = template.replace(/X/g, list[0].dataValues.Country);
      question = `${question.replace(/Y/g, list[1].dataValues.Country)}?`;
      return question;
    default:
      let { dataValues } = getRandomElements(list, 1)[0];
      return `${template}${dataValues.Country}?`;
  }
};
const getRelevantQuestionChoices = (ans_type) => {
  switch (ans_type) {
    case value:
      break;

    default:
      break;
  }
};
const generateRandomQuestion = async () => {
  const allCountries = await Countries.findAll({
    attributes: ["Country"],
  });
  const templates = await Template.findAll();
  const randomTemplate = getRandomElements(templates, 1);
  const { template_reqs, template, template_ans_type } = randomTemplate[0];
  const questionBody = getRelevantQuestionParams(
    template_reqs,
    template,
    allCountries
  );
  const questionChoices = getRelevantQuestionChoices();
  return {
    question: questionBody,
    choices: questionChoices,
  };
};

questions.get("/question", async (req, res) => {
  res.send(await generateRandomQuestion());
});

module.exports = questions;
