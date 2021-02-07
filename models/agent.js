"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  agent.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      description: DataTypes.TEXT,
      address: DataTypes.TEXT,
      token: DataTypes.TEXT,
      device_token: DataTypes.TEXT,
      follower: DataTypes.INTEGER,
      is_active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "agent",
    }
  );
  return agent;
};
