const { Router } = require("express");
const questions = require("./questions");
const api = Router();
api.use("/questions", questions);

module.exports = { api };
