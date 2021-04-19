const { Router } = require("express");
const UserManager = require("../sequelize/UserManager");
const users = Router();

users.get("/createanon", async (req, res) => {
  try {
    await UserManager.createAnonUser();
    res.status(200).send("Rating saved!");
  } catch ({ message }) {
    res.status(500).send("Failed to save rating!", message);
  }
});

module.exports = users;
