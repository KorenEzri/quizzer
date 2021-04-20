const { Router } = require("express");
const UserManager = require("../sequelize/UserManager");
const users = Router();

users.post("/createanon", async (req, res) => {
  const { user } = req.body;
  if (!user) res.send("No user sent");
  try {
    const response = await UserManager.createAnonUser(user);
    if (response === "OK") {
      res.status(200).send("User created!");
    }
    if (response === "Username already taken!") {
      res.status(200).send("User already taken!");
    }
  } catch ({ message }) {
    res.status(500).send("Failed to create user!", message);
  }
});
users.post("/highscore", async (req, res) => {
  const { score, user, elapsedTime } = req.body;
  try {
    res
      .status(200)
      .send(await UserManager.updateHighscore(score, user, elapsedTime));
  } catch ({ message }) {
    console.log(message);
    res.status(500).json({ message: "Failed to update highscore!", message });
  }
});

module.exports = users;
