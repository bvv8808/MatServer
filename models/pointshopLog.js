module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "pointshopLog",
    {
      buyerId: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shopName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      limitTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
