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
    time_played: Sequelize.NUMBER,
    last_rating: Sequelize.NUMBER,
    last_game_score: Sequelize.NUMBER,
    last_game_elapsed: Sequelize.NUMBER,
  },
  { freezeTableName: true }
);

module.exports = AnonUsers;
