const { Router } = require("express");
const questions = require("./questions");
const rating = require("./rating");
const api = Router();
api.use("/questions", questions);
api.use("/rating", rating);
module.exports = { api };
