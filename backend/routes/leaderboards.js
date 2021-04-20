const { Router } = require("express");
const AnonUsers = require("../sequelize/models/AnonUsers");
const leaderboards = Router();

leaderboards.get("/getscores", async (req, res) => {
  try {
    res.status(200).send(await AnonUsers.findAll());
  } catch ({ message }) {
    console.log(message);
    res.status(500).json({ message: "Internal server error,", message });
  }
});

module.exports = leaderboards;
