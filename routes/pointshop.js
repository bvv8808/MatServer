const router = require("express").Router();
const { PointshopItem } = require("../models");

const fillZero = (number) => {
  const strNumber = String(number);
  return strNumber.length === 1 ? "0" + strNumber : strNumber;
};

router.get("/getItems", (req, res, next) => {
  const { shopName } = req.query;
  PointshopItem.findAll({
    where: { shopName },
    order: [["neededPoint", "DESC"]],
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

module.exports = router;
