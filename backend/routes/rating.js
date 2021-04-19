const { Router } = require("express");
const SendRating = require("../sequelize/SendRating");
const rating = Router();

rating.post("/ratequestion", async (req, res) => {
  const { rating, question, credibility, choices } = req.body;
  if (!rating || !question) return res.status(400).send("No score sent");
  if (rating < 3 || credibility < 5) {
    res.status(200).send("Rating not saved");
    return;
  }
  try {
    await SendRating.saveRating(rating, question, choices);
    res.status(200).send("Rating saved!");
  } catch ({ message }) {
    res.status(500).json({ message: "Failed to save rating!", message });
  }
});

module.exports = rating;
