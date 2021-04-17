const { Sequelize } = require("sequelize");
const db = require("../sequelize");

const Population = db.define(
  "pop_density",
  {
    Country: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    Population: Sequelize.NUMBER,
  },
  { freezeTableName: true }
);

module.exports = Population;
