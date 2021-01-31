"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or Sequelize.UUIDV1
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      number_phone: DataTypes.STRING,
      password: DataTypes.STRING,
      img_profile: DataTypes.TEXT,
      point: DataTypes.INTEGER,
      status: DataTypes.STRING,
      token: DataTypes.TEXT,
      fcm_token: DataTypes.TEXT,
      is_active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
