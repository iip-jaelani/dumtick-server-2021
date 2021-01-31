"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ticket.belongsTo(models.category, {
        foreignKey: "id_category",
        as: "category",
      });
      ticket.hasMany(models.like, {
        foreignKey: "ticket_id",
        as: "likes",
      });
    }
  }
  ticket.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      id_category: DataTypes.TEXT,
      title: DataTypes.TEXT,
      description: DataTypes.TEXT,
      image: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      promo: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      start_time: DataTypes.DATEONLY,
      end_time: DataTypes.DATEONLY,
      is_active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ticket",
    }
  );
  return ticket;
};
