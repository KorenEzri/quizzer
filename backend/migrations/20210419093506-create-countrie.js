'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Countries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      country: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      pop: {
        type: Sequelize.NUMBER
      },
      area: {
        type: Sequelize.NUMBER
      },
      popDensity: {
        type: Sequelize.NUMBER
      },
      coastline: {
        type: Sequelize.NUMBER
      },
      netMigration: {
        type: Sequelize.NUMBER
      },
      birthrate: {
        type: Sequelize.NUMBER
      },
      deathrate: {
        type: Sequelize.NUMBER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Countries');
  }
};