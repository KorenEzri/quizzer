const { Sequelize } = require("sequelize");
const db = require("../sequelize");

const Template = db.define(
  "question_templates",
  {
    template_id: {
      type: Sequelize.NUMBER,
      allowNull: false,
      primaryKey: true,
    },
    template: Sequelize.STRING,
    template_reqs: Sequelize.STRING,
    template_ans_type: Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = Template;
