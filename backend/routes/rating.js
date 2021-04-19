const { Router } = require("express");
const SendRating = require("../sequelize/SendRating");
const rating = Router();

rating.post("/ratequestion", async (req, res) => {
  console.log("object");
  const { rating, question, credibility, choices } = req.body;
  if (!rating || !question) return res.status(400).send("No score sent");
  if (credibility < 5) {
    res.status(200).send("Rating not saved");
    return;
  }
  try {
    await SendRating.saveRating(rating, question, choices, credibility);
    res.status(200).send("Rating saved!");
  } catch ({ message }) {
    res.status(500).json({ message: "Failed to save rating!", message });
  }
});

module.exports = rating;
