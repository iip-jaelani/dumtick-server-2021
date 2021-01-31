"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      like.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "userData",
      });

      like.belongsTo(models.ticket, {
        foreignKey: "ticket_id",
        as: "ticketData",
      });
    }
  }
  like.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or Sequelize.UUIDV1
      },
      user_id: DataTypes.TEXT,
      ticket_id: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "like",
    }
  );
  return like;
};
