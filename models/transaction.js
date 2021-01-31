"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.ticket, {
        foreignKey: "ticket_id",
        as: "ticketData",
      });
      transaction.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "userData",
      });
    }
  }
  transaction.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or Sequelize.UUIDV1
      },
      user_id: DataTypes.TEXT,
      ticket_id: DataTypes.TEXT,
      address: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      promo: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      voucher_id: DataTypes.TEXT,
      status: DataTypes.STRING,
      methode_payment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "transaction",
    }
  );
  return transaction;
};
