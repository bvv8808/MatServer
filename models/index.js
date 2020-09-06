const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require("./user")(sequelize, Sequelize);
db.Pin = require("./pin")(sequelize, Sequelize);
db.UserTemplate = require("./UserTemplate")(sequelize, Sequelize);
db.Notice = require("./notice")(sequelize, Sequelize);
db.PurchaseLog = require("./purchaseLog")(sequelize, Sequelize);
db.PointshopItem = require("./pointshopItem")(sequelize, Sequelize);

db.User.hasMany(db.UserTemplate, { foreignKey: "makerId", sourceKey: "id" });
db.UserTemplate.belongsTo(db.User, { foreignKey: "makerId", targetKey: "id" });

module.exports = db;
