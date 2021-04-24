"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("AnonUsers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      highscore: {
        type: Sequelize.INTEGER,
      },
      highscoreDate: {
        type: Sequelize.DATE,
      },
      timePlayed: {
        type: Sequelize.INTEGER,
      },
      lastRating: {
        type: Sequelize.INTEGER,
      },
      lastGameScore: {
        type: Sequelize.INTEGER,
      },
      lastGameElapsed: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("AnonUsers");
  },
};
