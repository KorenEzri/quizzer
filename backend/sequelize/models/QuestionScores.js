const { Sequelize } = require("sequelize");
const SavedQuestions = require("./SavedQuestions");
const db = require("../sequelize");

const QuestionScores = db.define(
  "question_scores",
  {
    id: {
      type: Sequelize.NUMBER,
      primaryKey: true,
    },
    question_id: {
      type: Sequelize.NUMBER,
      references: {
        model: SavedQuestions,
        key: "question_id",
        allowNull: true,
      },
    },
    score_1: Sequelize.NUMBER,
    score_2: Sequelize.NUMBER,
    score_3: Sequelize.NUMBER,
    score_4: Sequelize.NUMBER,
    score_5: Sequelize.NUMBER,
  },
  { freezeTableName: true }
);

module.exports = QuestionScores;
