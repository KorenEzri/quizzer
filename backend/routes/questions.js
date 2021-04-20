const { Router } = require("express");
const QuestionGenerator = require("../sequelize/QuestionGenerator");
const questions = Router();

questions.get("/question", async (req, res) => {
  try {
    res.status(200).send(await QuestionGenerator.generateQuestion());
  } catch ({ message }) {
    try {
      console.log("Error, retrying..", message);
      res.status(200).send(await QuestionGenerator.generateQuestion());
    } catch ({ message }) {
      console.log(message);
      res.status(500).json({
        message: `There was a problem processing the request, ${message}`,
      });
    }
  }
});
questions.put("/answer", async (req, res) => {
  const { answer } = req.body;
  console.log(answer);
  try {
    res.status(200).send(QuestionGenerator.checkIfCorrect(answer));
  } catch ({ message }) {
    console.log(message);
    res
      .status(500)
      .send(`There was a problem processing the request, ${message}`);
  }
});

module.exports = questions;
