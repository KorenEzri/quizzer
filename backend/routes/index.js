const { Router } = require("express");
const questions = require("./questions");
// const data = require("./data");
const api = Router();
api.use("/questions", questions);
// api.use("/data", data);

module.exports = { api };
