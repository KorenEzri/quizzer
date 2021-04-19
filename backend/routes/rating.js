const { Router } = require("express");
const SendRating = require("../sequelize/SendRating");
const rating = Router();

rating.get("/ratequestion", async (req, res) => {
  try {
    await SendRating.saveRating();
    res.status(200).send("Rating saved!");
  } catch ({ message }) {
    res.status(500).send("Failed to save rating!", message);
  }
});

module.exports = rating;
