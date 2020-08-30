const express = require("express");
const Notice = require("../models").Notice;
const router = express.Router();

router.get("/getAll", async (req, res, next) => {
  await Notice.findAll({})
    .then((data) => {
      res.send({ code: 0, msg: "notice", data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: err });
    });
});

module.exports = router;
