module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "purchaseLog",
    {
      buyerId: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
      },
      itemName: {
        type: DataTypes.SRING,
        allowNull: false,
      },
      shopName: {
        type: DataType.SRING,
        allowNull: false,
      },
      itemKey: {
        type: DataType.SRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
