const express = require("express");
const { PurchaseLog } = require("../models");
const router = express.Router();
const Template = require("../models").UserTemplate;
const { User, Pin, Sequelize } = require("../models");
const Op = Sequelize.Op;

router.get("/", async (req, res, next) => {
  //select * from usertemplates  =>result=objcet
  console.log("template들어옴");
  await Template.findAll({})
    .then((data) => res.send({ code: 0, Allselect: data }))
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: err });
    });
});

router.get("/getOne", async (req, res, next) => {
  //select * from templates where id=?
  console.log("template.select들어옴");
  var temId = req.query.temId;

  await Template.findOne({ where: { id: temId } })
    .then((data) => {
      data.fullData = data.fullData.toString("utf8");
      res.send({ code: 0, resData: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: err });
    });
});

router.get("/getByUser", async (req, res, next) => {
  const makerId = req.query.makerId;
  Template.findAll({
    where: { makerId: makerId },
    attributes: ["fullData", "id"],
  })
    .then((tems) => {
      const resultTems = tems.map((tem) => {
        tem.fullData = tem.fullData.toString("utf8");
        return tem;
      });

      res.json({
        code: 0,
        len: tems.length,
        resData: resultTems,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: -1 });
    });
});

router.post("/deleteRegistedTem", (req, res, next) => {
  //delete from template where makerID=?,fullData=?
  const { makerId, temIds } = req.body;

  Template.destroy({
    where: {
      makerId,
      id: {
        [Op.in]: temIds,
      },
    },
  })
    .then(() => res.json({ code: 0 }))
    .catch((err) => {
      console.log(err);
      res.json({ code: -1, msg: "Sequelize ERR" });
    });
});

router.post("/deletePurchasedTem", (req, res, next) => {
  const { buyerId, temIds } = req.body;

  PurchaseLog.destroy({
    where: {
      buyerId,
      temId: {
        [Op.in]: temIds,
      },
    },
  })
    .then(() => res.json({ code: 0 }))
    .catch((err) => {
      console.log(err);
      res.json({ code: -1, msg: "Sequelize ERR" });
    });
});

router.post("/makertem", async (req, res, next) => {
  console.log("makertem들어옴");
  var makerId = req.body.makerId;
  await Template.findAll({
    where: { makerId: makerId },
  })
    .then((data) => {
      let dataLength = Object.keys(data).length;
      for (i = 0; i < dataLength; i++) {
        data[i].fullData = data[i].fullData.toString("utf8");
      }
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/regist", (req, res, next) => {
  //insert into usertemplates (makeId, fullData, price, category) values (?,?,?,?);
  console.log("template.regist");
  var makerId = req.body.makerId;
  var fullData = req.body.fullData;
  var price = req.body.price;
  var category = req.body.category;
  console.log(makerId, price);

  Template.create({
    makerId: makerId,
    fullData: fullData,
    price: price,
    cntBuy: 0,
    cntWatch: 0,
    category: category,
  })
    .then(res.json({ code: 0 }))
    .catch((err) => {
      console.log(err);
    });
});

router.get("/resData", async (req, res, next) => {
  let limit = 10;
  var result = {
    totalData: "value1",
    totalPage: "value3",
    currentPage: "values2",
    resData: "values4",
  };
  const { filterName, categoryName, page } = req.query;

  if (req.query.page == null) {
    offset = 0;
    result.currentPage = 1;
  } else {
    offset = (page - 1) * 10;
    result.currentPage = page;
    console.log(offset, result.currentPage);
  }
  await Template.findAll({})
    .then((data) => {
      var totaldata = String(Object.keys(data).length);
      var data_ex2 = Math.floor(totaldata / 10);
      var data_ex3 = Math.floor(data_ex2 + 1);

      pageMath = () => {
        if ((data_ex1 = 0)) {
          return data_ex2;
        } else {
          return data_ex3;
        }
      };
      resultMath = pageMath();
      result.totalPage = resultMath;
    })
    .catch((err) => {
      console.log(err);
    });

  await Template.findAll({}) //totaldata
    .then((data) => {
      var totaldata = Object.keys(data).length;
      result.totalData = totaldata;
    })
    .catch((err) => {
      console.log(err);
    });

  // *******************************************************************
  let where = {};
  let order = [];
  if (filterName) {
    switch (filterName) {
      case "최신순":
        order = [["id", "DESC"]];
        break;
      case "인기순":
        order = [["cntBuy", "DESC"]];
        break;
      case "최고가":
        order = [["price", "DESC"]];
        break;
      case "최저가":
        order = [["price", "ASC"]];
        break;
    }
  }
  if (categoryName) {
    where.category = categoryName;
  }

  console.log("# where #", where);
  await Template.findAll({
    //paging data
    offset: offset,
    limit: limit,
    // attributes:customAttribute
    where,
    // where: where
    // where: categoryName? where: {}
    order,
  })
    .then((data) => {
      let dataLength = Object.keys(data).length;
      for (i = 0; i < dataLength; i++) {
        data[i].fullData = data[i].fullData.toString("utf8");
      }
      result.resData = data;
    })
    .catch((err) => {
      console.log(err);
    });
  res.send(result);
});

router.post("/purchase", async (req, res, next) => {
  const { buyerId, temId } = req.body;
  console.log("## buyerId, temId ##", buyerId, temId);

  const findTargetTem = () => {
    return Template.findOne({
      where: { id: temId },
      attributes: ["id", "makerId", "price", "cntBuy"],
    });
  };

  const purchase = async (tem) => {
    console.log("## tem ##", tem);

    const { makerId, price, cntBuy } = tem;

    const buyer = await User.findOne({
      where: { id: buyerId },
      attributes: ["id", "point"],
    });
    const maker = await User.findOne({
      where: { id: makerId },
      attributes: ["id", "point"],
    });
    console.log("## buyer and maker ##", buyer, maker);
    if (buyer.point < price) return next();

    await PurchaseLog.create({ buyerId, temId });
    // return {buyer, maker, price: tem.price}
    User.update({ point: buyer.point - price }, { where: { id: buyerId } });
    User.update({ point: maker.point + price }, { where: { id: makerId } });
    Template.update({ cntBuy: cntBuy + 1 }, { where: { id: tem.id } });

    res.json({ code: 0, newPoint: buyer.point - price });
  };

  findTargetTem()
    .then(purchase)
    .catch((err) => {
      console.log(err);
      res.json({ code: -1 });
    });
});

router.get("/purchaseLog", async (req, res, next) => {
  const { buyerId } = req.query;
  PurchaseLog.findAll({
    where: { buyerId: Number(buyerId) },
    attributes: ["temId"],
  })
    .then((logs) => {
      return logs.map((log) => log.dataValues.temId);
    })
    .then((temIds) => {
      return Template.findAll({
        where: {
          id: {
            [Op.in]: temIds,
          },
        },
      });
    })
    .then((tems) => {
      const resultTems = tems.map((tem) => {
        tem.fullData = tem.fullData.toString("utf8");
        return tem;
      });
      res.json({ code: 0, tems: resultTems }); /////////////////
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: -1 });
    });
});

module.exports = router;
