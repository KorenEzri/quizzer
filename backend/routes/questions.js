const { Router } = require("express");
const QuestionGenerator = require("../sequelize/QuestionGenerator");
const questions = Router();
const DBconnection = require(".././sequelize/sequelize");

questions.get("/question", async (req, res) => {
  try {
    res.status(200).send(await QuestionGenerator.generateRandomQuestion());
  } catch ({ message }) {
    try {
      console.log("Error, retrying..", message);
      res.status(200).send(await QuestionGenerator.generateRandomQuestion());
    } catch ({ message }) {
      console.log(message);
      res.status(500).json({
        message: `There was a problem processing the request, ${message}`,
      });
    }
  }
});

module.exports = questions;
