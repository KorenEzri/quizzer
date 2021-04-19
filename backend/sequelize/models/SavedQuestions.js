const { Sequelize } = require("sequelize");
const db = require("../sequelize");

const SavedQuestions = db.define(
  "questions",
  {
    question_id: {
      type: Sequelize.NUMBER,
      allowNull: false,
      primaryKey: true,
    },
    question: Sequelize.STRING,
    is_active: Sequelize.STRING,
    choice: Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = SavedQuestions;
