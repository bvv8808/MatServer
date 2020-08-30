module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "usertemplate",
    {
      makerId: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
      },
      fullData: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
      },
      cntBuy: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
      },
      cntWatch: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
