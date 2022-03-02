"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users_officials extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users_officials.init(
    {
      userId: DataTypes.INTEGER,
      officialId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "users_officials",
    }
  );
  return users_officials;
};
