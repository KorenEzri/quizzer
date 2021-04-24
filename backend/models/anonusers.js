"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AnonUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AnonUsers.init(
    {
      name: DataTypes.STRING,
      highscore: DataTypes.INTEGER,
      highscoreDate: DataTypes.DATE,
      timePlayed: DataTypes.INTEGER,
      lastRating: DataTypes.INTEGER,
      lastGameScore: DataTypes.INTEGER,
      lastGameElapsed: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AnonUsers",
    }
  );
  return AnonUsers;
};
