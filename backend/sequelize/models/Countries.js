const { Sequelize } = require("sequelize");
const db = require("../sequelize");

const Countries = db.define(
  "countries",
  {
    Country: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    Region: Sequelize.STRING,
    Population: Sequelize.NUMBER,
    Area_sq_mi: Sequelize.NUMBER,
    Pop_Density_per_sq_mi: Sequelize.NUMBER,
    Coastline_coast_area_ratio: Sequelize.NUMBER,
    Net_migration: Sequelize.NUMBER,
    Infant_mortality_per_1000_births: Sequelize.NUMBER,
    GDP_per_capita: Sequelize.NUMBER,
    Literacy: Sequelize.NUMBER,
    Phones_per_1000: Sequelize.NUMBER,
    Arable: Sequelize.NUMBER,
    Crops: Sequelize.NUMBER,
    Other: Sequelize.NUMBER,
    Climate: Sequelize.NUMBER,
    Birthrate: Sequelize.NUMBER,
    Deathrate: Sequelize.NUMBER,
    Agriculture: Sequelize.NUMBER,
    Industry: Sequelize.NUMBER,
    Service: Sequelize.NUMBER,
  },
  { freezeTableName: true }
);

module.exports = Countries;
