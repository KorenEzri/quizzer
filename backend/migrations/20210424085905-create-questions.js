"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("questions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      questionTemplate: {
        type: Sequelize.STRING,
      },
      questionFull: {
        type: Sequelize.STRING,
      },
      choiceOneCountry: {
        type: Sequelize.STRING,
      },
      choiceOneData: {
        type: Sequelize.STRING,
      },
      choiceTwoCountry: {
        type: Sequelize.STRING,
      },
      choiceTwoData: {
        type: Sequelize.STRING,
      },
      choiceThreeCountry: {
        type: Sequelize.STRING,
      },
      choiceThreeData: {
        type: Sequelize.STRING,
      },
      choiceCorrectCountry: {
        type: Sequelize.STRING,
      },
      choiceCorrectData: {
        type: Sequelize.STRING,
      },
      scoreOne: {
        type: Sequelize.INTEGER,
      },
      scoreTwo: {
        type: Sequelize.INTEGER,
      },
      scoreThree: {
        type: Sequelize.INTEGER,
      },
      scoreFour: {
        type: Sequelize.INTEGER,
      },
      scoreFive: {
        type: Sequelize.INTEGER,
      },
      lastRatedBy: {
        type: Sequelize.STRING,
      },
      lastRating: {
        type: Sequelize.INTEGER,
      },
      finalScore: {
        type: Sequelize.INTEGER,
      },
      concatinatedScore: {
        type: Sequelize.INTEGER,
      },
      concatinatedScoreWithRates: {
        type: Sequelize.INTEGER,
      },
      questionType: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("questions");
  },
};
