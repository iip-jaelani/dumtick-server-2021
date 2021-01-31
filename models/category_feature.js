"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category_feature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      category_feature.hasMany(models.ticket, {
        foreignKey: "id_category",
        as: "tickets_list",
      });
      // define association here
    }
  }
  category_feature.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      image: DataTypes.TEXT,
      is_active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "category_feature",
    }
  );
  return category_feature;
};
