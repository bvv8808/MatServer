module.exports = (sequelize, types) =>
  sequelize.define(
    "pointshopItem",
    {
      neededPoint: {
        type: types.INTEGER(50),
        allowNull: false,
      },
      caution: {
        type: types.STRING,
        allowNull: false,
      },
      detail: {
        type: types.STRING,
        allowNull: false,
      },
      title: {
        type: types.STRING,
        allowNull: false,
      },
      shopName: {
        type: types.STRING,
        allowNull: false,
      },
      availableMoney: {
        type: types.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
