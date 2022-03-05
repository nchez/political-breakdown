'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_stocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users_stocks.init({
    userId: DataTypes.INTEGER,
    stockId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users_stocks',
  });
  return users_stocks;
};