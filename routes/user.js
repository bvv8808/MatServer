const express = require("express");
const router = express.Router();
const { User, UserTemplate, PurchaseLog } = require("../models");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./middlewares");
const bcrypt = require("bcrypt");

router.post("/signUp", async (req, res) => {
  const { userId, password, name, birth, phone } = req.body;
  if (userId && password) {
    await User.findOne({ where: { userId } }).then((data) => {
      if (data == null) {
        User.create({
          userId,
          password: bcrypt.hashSync(password, 2),
          name,
          birth,
          phone,
          point: 0,
        });
        res.json({ code: 0 });
      } else {
        res.json({ code: 1, msg: "existed user" });
      }
    });
  } else if (userId) {
    res.json({ code: 2, msg: "no pw" });
  } else if (password) {
    res.json({ code: 2, msg: "no id" });
  }
});

router.post("/signIn", (req, res, next) => {
  User.findOne({
    where: { userId: req.body.userId },
  }).then(function (user) {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
          {
            userId: req.query.userId,
            password: req.query.password,
          },
          process.env.JWT_SECRET,
          {
            issuer: "kimozzi",
          }
        );
        res.json({
          code: 0,
          idOnServer: user.id,
          token,
          point: user.point,
          name: user.name,
          uid: user.userId,
        });
      } else {
        res.json({
          code: 1,
          msg: "wrong password",
        });
      }
    } else {
      res.json({ code: 2, msg: "not existed user" });
    }
  });
});
router.post("/changePassword", async (req, res, next) => {
  const idOnServer = req.body.idOnServer;
  const oldPw = req.body.oldPw; //asd2424

  await User.findOne({ where: { id: idOnServer } })
    .then((data) => {
      if (bcrypt.compareSync(oldPw, data.password)) {
        const newPw = bcrypt.hashSync(req.body.newPw, 2);
        User.update({ password: newPw }, { where: { id: idOnServer } });
        res.send({ code: 0, msg: "change password success" });
      } else {
        res.send({ code: -1, msg: "password error" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: err });
    });
});
router.post("/exitUser", async (req, res, next) => {
  await User.destroy({ where: { id: req.body.idOnServer } })
    .then((data) => {
      res.send({ code: 0 });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: err });
    });
});

// router.post("/price", async (req, res, next) => {
//   buyUserId = req.body.id;
//   sellTemId = req.body.temid;
//   buyUserPoint = 0;
//   sellUserPoint = 0;
//   makerId = 0;
//   let cntBuy = 0;

//   await User.findOne({ where: { id: buyUserId }, attributes: ["point"] })
//     .then((data) => {
//       console.log(data.point);
//       buyUserPoint = data.point;
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send({ code: -1, msg: "userid error" });
//     });

//   await UserTemplate.findOne({
//     where: { id: sellTemId },
//     attributes: ["price", "makerId", "cntBuy"],
//   })
//     .then((data) => {
//       cntBuy = data.cntBuy;
//       temprice = data.price;
//       makerId = data.makerId;
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send({ code: -1, msg: "template id error" });
//     });
//   await User.findOne({
//     where: { id: makerId },
//     attributes: ["point"],
//   })
//     .then((data) => {
//       sellUserPoint = data.point;
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send({ code: -1, msg: "maker id error" });
//     });

//   if (buyUserPoint >= temprice) {
//     resultUserpoint = buyUserPoint - temprice;
//     resultMakerpoint = sellUserPoint + temprice;
//     await User.update({ point: resultUserpoint }, { where: { id: buyUserId } });
//     await User.update({ point: resultMakerpoint }, { where: { id: makerId } });
//     await UserTemplate.update(
//       { cntBuy: cntBuy + 1 },
//       { where: { id: sellTemId } }
//     );
//     res.send({
//       code: 0,
//       newPoint: resultUserpoint,
//       msg: "purchase success",
//     });
//   } else {
//     res.send({ code: -1, msg: "point가 부족합니다." });
//   }
// });

module.exports = router;
