const router = require("express").Router();
const { PointshopItem, PointshopLog, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

const fillZero = (number) => {
  const strNumber = String(number);
  return strNumber.length === 1 ? "0" + strNumber : strNumber;
};

router.get("/getItems", (req, res, next) => {
  const { shopName } = req.query;
  PointshopItem.findAll({
    where: { shopName },
    order: [["neededPoint", "ASC"]],
  })
    .then((items) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();
      const limitTime = `${year}.${fillZero(month)}.${fillZero(day)}`;

      return items.map((item) => {
        item.limitTime = limitTime;
        return item;
      });
    })
    .then((resItems) => {
      res.json({ code: 0, resData: resItems });
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: -1, msg: err });
    });
});

router.post("/purchase", (req, res, next) => {
  const { itemName, shopName, buyerId, newPoint } = req.body;

  User.update({ point: newPoint }, { where: { id: buyerId } })
    .then(() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();
      const limitTime = `${year}.${fillZero(month)}.${fillZero(day)}`;

      const key = uuidv4();
      PointshopLog.create({
        buyerId,
        itemName,
        shopName,
        itemKey: key,
        limitTime,
      });
      return { key, limitTime };
    })
    .then((resObj) => {
      resObj.code = 0;
      res.json(resObj);
    })
    .catch((err) => res.json({ code: -1 }));
});
// ???
module.exports = router;
