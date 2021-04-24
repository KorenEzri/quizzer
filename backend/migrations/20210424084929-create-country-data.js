"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CountryData", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Country: {
        type: Sequelize.STRING,
      },
      Population: {
        type: Sequelize.INTEGER,
      },
      Region: {
        type: Sequelize.STRING,
      },
      AreaSqMi: {
        type: Sequelize.INTEGER,
      },
      PopDensity: {
        type: Sequelize.INTEGER,
      },
      coastlineArea: {
        type: Sequelize.INTEGER,
      },
      netMigration: {
        type: Sequelize.INTEGER,
      },
      infantMortality: {
        type: Sequelize.INTEGER,
      },
      GDP: {
        type: Sequelize.INTEGER,
      },
      literacy: {
        type: Sequelize.INTEGER,
      },
      phonesPerThousand: {
        type: Sequelize.INTEGER,
      },
      arable: {
        type: Sequelize.INTEGER,
      },
      crops: {
        type: Sequelize.INTEGER,
      },
      climate: {
        type: Sequelize.INTEGER,
      },
      birthrate: {
        type: Sequelize.INTEGER,
      },
      deathrate: {
        type: Sequelize.INTEGER,
      },
      agriculture: {
        type: Sequelize.INTEGER,
      },
      service: {
        type: Sequelize.INTEGER,
      },
      capitalName: {
        type: Sequelize.STRING,
      },
      capitalLatitude: {
        type: Sequelize.STRING,
      },
      capitalLongitude: {
        type: Sequelize.STRING,
      },
      countryCode: {
        type: Sequelize.STRING,
      },
      continentName: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CountryData");
  },
};
