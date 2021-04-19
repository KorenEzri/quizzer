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
    question_template: Sequelize.STRING,
    question_full: Sequelize.STRING,
    choice_1_country: Sequelize.STRING,
    choice_1_data: Sequelize.STRING,
    choice_2_country: Sequelize.STRING,
    choice_2_data: Sequelize.STRING,
    choice_3_country: Sequelize.STRING,
    choice_3_data: Sequelize.STRING,
    choice_correct_country: Sequelize.STRING,
    choice_correct_data: Sequelize.STRING,
    score_1: Sequelize.NUMBER,
    score_2: Sequelize.NUMBER,
    score_3: Sequelize.NUMBER,
    score_4: Sequelize.NUMBER,
    score_5: Sequelize.NUMBER,
  },
  {
    freezeTableName: true,
  }
);

module.exports = SavedQuestions;
