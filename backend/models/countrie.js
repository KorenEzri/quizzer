'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Countrie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Countrie.init({
    country: DataTypes.STRING,
    region: DataTypes.STRING,
    pop: DataTypes.NUMBER,
    area: DataTypes.NUMBER,
    popDensity: DataTypes.NUMBER,
    coastline: DataTypes.NUMBER,
    netMigration: DataTypes.NUMBER,
    birthrate: DataTypes.NUMBER,
    deathrate: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Countrie',
  });
  return Countrie;
};