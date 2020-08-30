module.exports = (sequelize, types) =>
  sequelize.define(
    "pin",
    {
      userId: {
        type: types.INTEGER(50),
        allowNull: false,
      },
      cardId: {
        type: types.INTEGER(50),
        allowNull: false,
      },
      pin: {
        type: types.INTEGER(50),
        allowNull: false,
      },
      fullData: {
        type: types.BLOB("long"),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
