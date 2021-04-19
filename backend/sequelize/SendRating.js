const SavedQuestions = require("../sequelize/models/SavedQuestions");
const { Sequelize } = require("sequelize");

const getScore = (rating, check) => {
  if (rating === check) return rating;
};
const saveRating = async (rating, question, choices, credibility) => {
  let savedQuestion;
  let created;
  try {
    [savedQuestion, created] = await SavedQuestions.findOrCreate({
      where: { question_full: `${question}` },
      defaults: { question_full: 0, question: question },
    });
  } catch ({ message }) {
    console.log(message);
  }
};

module.exports = { saveRating };
