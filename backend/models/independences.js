'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class independences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  independences.init({
    Country: DataTypes.STRING,
    dateOfHoliday: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'independences',
  });
  return independences;
};