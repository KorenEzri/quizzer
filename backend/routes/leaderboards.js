const { Router } = require("express");
const UserManager = require("../UserManager");
const leaderboards = Router();

leaderboards.get("/getscores", async (req, res) => {
  try {
    res.status(200).send(await UserManager.findAllusers());
  } catch ({ message }) {
    console.log(message);
    res.status(500).json({ message: "Internal server error,", message });
  }
});

module.exports = leaderboards;
