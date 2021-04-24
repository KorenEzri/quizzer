'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class questionTemplates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  questionTemplates.init({
    template: DataTypes.STRING,
    templateReqs: DataTypes.STRING,
    templateAnsType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'questionTemplates',
  });
  return questionTemplates;
};