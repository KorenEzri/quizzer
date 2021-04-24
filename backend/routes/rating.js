const { Router } = require("express");
const SendRating = require("../SendRating");
const QuestionGenerator = require("../QuestionGenerator");
const rating = Router();

rating.post("/ratequestion", (req, res) => {
  const { rating, credibilityPoints, timeElapsed, name } = req.body;
  const credibility = { credibilityPoints, timeElapsed };
  if (!rating) return res.status(400).send("No score sent");
  try {
    SendRating.receieveRatingRequest(
      rating,
      QuestionGenerator.getFullQuestionForRating(),
      credibility,
      name
    );
    res.status(200).send("Rating saved!");
  } catch ({ message }) {
    res.status(500).json({ message: "Failed to save ratings!", message });
  }
});

rating.post("/triggersequence", async (req, res) => {
  const { score } = req.body;
  try {
    await QuestionGenerator.initRatingSequence(score);
    res.status(200).send("OK");
  } catch ({ message }) {
    console.log("ERROR WITH /triggersequence at rating.js at ~line 23");
    res.status(500).send("Failed to save ratings");
  }
});
module.exports = rating;
