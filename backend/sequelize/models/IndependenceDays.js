const { Sequelize } = require("sequelize");
const db = require("../sequelize");

const IndependeceDays = db.define(
  "independence_days",
  {
    Country: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    Date_of_holiday: Sequelize.STRING,
    Year_celebrated: Sequelize.STRING,
    Event_celebrated: Sequelize.STRING,
    Name_of_holiday: Sequelize.STRING,
  },
  { freezeTableName: true }
);

module.exports = IndependeceDays;
