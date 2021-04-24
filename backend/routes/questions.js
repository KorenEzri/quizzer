const { Router } = require("express");
const QuestionGenerator = require("../QuestionGenerator");
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
  const { answer, difficulty } = req.body;
  try {
    res.status(200).send(QuestionGenerator.checkIfCorrect(answer, difficulty));
  } catch ({ message }) {
    console.log(message);
    res
      .status(500)
      .send(`There was a problem processing the request, ${message}`);
  }
});

questions.get("/end", async (req, res) => {
  QuestionGenerator.handleGameStart();
  res.status(200).send("OK");
});

module.exports = questions;
