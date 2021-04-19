"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Capitals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Capitals.init(
    {
      Country: DataTypes.STRING,
      CapitalName: DataTypes.STRING,
      CountryCode: DataTypes.STRING,
      ContinentName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Capitals",
    }
  );
  return Capitals;
};
