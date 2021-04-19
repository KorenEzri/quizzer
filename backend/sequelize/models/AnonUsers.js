const { Sequelize } = require("sequelize");
const db = require("../sequelize");

const AnonUsers = db.define(
  "anon_users",
  {
    id: {
      type: Sequelize.NUMBER,
      allowNull: false,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    highscore: Sequelize.NUMBER,
    highscore_date: Sequelize.DATE,
  },
  { freezeTableName: true }
);

module.exports = AnonUsers;
