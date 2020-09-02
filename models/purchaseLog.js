module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "purchaseLog",
    {
      buyerId: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
      },
      temId: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
