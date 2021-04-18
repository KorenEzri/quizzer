const { Router } = require("express");
const network = require("../sequelize/network");
const questions = Router();
const DBconnection = require(".././sequelize/sequelize");

questions.get("/question", async (req, res) => {
  try {
    res.status(200).send(await network.generateRandomQuestion());
  } catch ({ message }) {
    try {
      res.status(200).send(await network.generateRandomQuestion());
    } catch ({ message }) {
      console.log(message);
      res.status(500).json({
        message: `There was a problem processing the request, ${message}`,
      });
    }
  }
});

module.exports = questions;
