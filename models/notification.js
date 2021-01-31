"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notification.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or Sequelize.UUIDV1
      },
      user_id: DataTypes.TEXT,
      message: DataTypes.TEXT,
      chanel_id: DataTypes.STRING,
      is_read: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "notification",
    }
  );
  return notification;
};
