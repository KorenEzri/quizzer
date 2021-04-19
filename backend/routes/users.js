const { Router } = require("express");
const UserManager = require("../sequelize/UserManager");
const users = Router();

users.post("/createanon", async (req, res) => {
  const { user } = req.body;
  if (!user) res.send("No user sent");
  try {
    await UserManager.createAnonUser(user);
    res.status(200).send("User created!");
  } catch ({ message }) {
    res.status(500).send("Failed to create user!", message);
  }
});

module.exports = users;
