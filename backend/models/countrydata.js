"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CountryData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CountryData.init(
    {
      Country: DataTypes.STRING,
      Population: DataTypes.INTEGER,
      Region: DataTypes.STRING,
      AreaSqMi: DataTypes.INTEGER,
      PopDensity: DataTypes.INTEGER,
      coastlineArea: DataTypes.INTEGER,
      netMigration: DataTypes.INTEGER,
      infantMortality: DataTypes.INTEGER,
      GDP: DataTypes.INTEGER,
      literacy: DataTypes.INTEGER,
      phonesPerThousand: DataTypes.INTEGER,
      arable: DataTypes.INTEGER,
      crops: DataTypes.INTEGER,
      climate: DataTypes.INTEGER,
      birthrate: DataTypes.INTEGER,
      deathrate: DataTypes.INTEGER,
      agriculture: DataTypes.INTEGER,
      service: DataTypes.INTEGER,
      capitalName: DataTypes.STRING,
      capitalLatitude: DataTypes.STRING,
      capitalLongitude: DataTypes.STRING,
      countryCode: DataTypes.STRING,
      continentName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CountryData",
    }
  );
  return CountryData;
};
