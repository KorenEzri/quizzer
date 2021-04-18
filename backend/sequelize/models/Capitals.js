const { Sequelize } = require("sequelize");
const db = require("../sequelize");

const Capitals = db.define(
  "capitals",
  {
    Country: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    CapitalName: Sequelize.STRING,
    CapitalLatitude: Sequelize.NUMBER,
    CapitalLongitude: Sequelize.NUMBER,
    CountryCode: Sequelize.STRING,
    ContinentName: Sequelize.STRING,
  },
  { freezeTableName: true }
);

module.exports = Capitals;
