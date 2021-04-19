const { Sequelize } = require("sequelize");
const SavedQuestions = require("./SavedQuestions");
const db = require("../sequelize");

const QuestionChoices = db.define(
  "question_choices",
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
    is_right_choice: Sequelize.BOOLEAN,
    choice_country: Sequelize.STRING,
    choice_data: Sequelize.STRING,
  },
  { freezeTableName: true }
);

module.exports = QuestionChoices;
