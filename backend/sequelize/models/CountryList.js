const { Sequelize } = require("sequelize");
const db = require("../sequelize");

const CountryList = db.define(
  "country_list",
  {
    Country: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  { freezeTableName: true }
);

module.exports = CountryList;
