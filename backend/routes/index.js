const { Router } = require("express");
const questions = require("./questions");
const rating = require("./rating");
const users = require("./users");
const api = Router();
api.use("/questions", questions);
api.use("/rating", rating);
api.use("/users", users);
module.exports = { api };
