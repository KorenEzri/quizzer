"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  questions.init(
    {
      questionTemplate: DataTypes.STRING,
      questionFull: DataTypes.STRING,
      choiceOneCountry: DataTypes.STRING,
      choiceOneData: DataTypes.STRING,
      choiceTwoCountry: DataTypes.STRING,
      choiceTwoData: DataTypes.STRING,
      choiceThreeCountry: DataTypes.STRING,
      choiceThreeData: DataTypes.STRING,
      choiceCorrectCountry: DataTypes.STRING,
      choiceCorrectData: DataTypes.STRING,
      scoreOne: DataTypes.INTEGER,
      scoreTwo: DataTypes.INTEGER,
      scoreThree: DataTypes.INTEGER,
      scoreFour: DataTypes.INTEGER,
      scoreFive: DataTypes.INTEGER,
      lastRatedBy: DataTypes.STRING,
      lastRating: DataTypes.INTEGER,
      finalScore: DataTypes.INTEGER,
      concatinatedScore: DataTypes.INTEGER,
      concatinatedScoreWithRates: DataTypes.INTEGER,
      questionType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "questions",
    }
  );
  return questions;
};
