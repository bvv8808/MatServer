module.exports = (sequelize, types) =>
  sequelize.define(
    "notice",
    {
      title: {
        type: types.STRING(50),
        allowNull: false,
      },
      content: {
        type: types.STRING(200),
        allowNull: false,
      },
      createdAt: {
        type: types.STRING(50),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
