"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class official extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  official.init(
    {
      name: DataTypes.STRING,
      position: DataTypes.STRING,
      state: DataTypes.STRING,
      party: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "official",
    }
  );
  return official;
};
