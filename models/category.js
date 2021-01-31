"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      category.hasMany(models.ticket, {
        foreignKey: "id_category",
        as: "tickets_list",
      });
    }
  }
  category.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or Sequelize.UUIDV1
      },
      name: DataTypes.STRING,
      image: DataTypes.TEXT,
      is_active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "category",
    }
  );
  return category;
};
