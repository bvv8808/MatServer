const express = require("express");
const Pin = require("../models").Pin;
const router = express.Router();

/** PIN 발급 */
router.post("/create", async (req, res, next) => {
  const { userId, cardId, fullData } = req.body;
  // 필요한 함수1
  const pinCreateRandom = (
    min,
    max //랜덤함수에 범위 설정
  ) => Math.floor(Math.random() * (max - min + 1)) + min;

  // 필요한 함수2
  const createUniquePin = async () => {
    // 난수의 자릿수 설정
    var pin = pinCreateRandom(1000, 9999);

    while (await Pin.findOne({ where: { pin } })) {
      //중복검사
      pin = pinCreateRandom(1000, 9999);
    }
    return pin;
  };
  // RUN
  const existPin = await Pin.findOne({
    //pin 생성 후 db에 저장
    where: { userId, cardId },
    attributes: ["pin"],
  });
  if (existPin) {
    res.json({ code: 1, msg: "PIN already exists", pin: existPin.pin });
  } else {
    const madePin = await createUniquePin();
    await Pin.create({ userId, cardId, fullData, pin: madePin })
      .then((pinObj) => {
        console.log("#1########### ", pinObj.fullData);
        setTimeout(() => {
          Pin.destroy({ where: { pin: pinObj.pin } });
        }, 60000);

        res.json({ code: 0, msg: "성공", pin: pinObj.pin });
      })
      .catch((err) => {
        console.log(err);
        res.json({ code: -1, msg: err });
      });
  }
});

// PIN번호를 받아서 해당 fullData를 응답
router.get("/read", async (req, res, next) => {
  console.log("pin번호 조회를 통한 fulldata전송");
  const { pin } = req.query;
  await Pin.findOne({ where: { pin }, attributes: ["fullData"] })
    .then((data) => {
      res.send(
        data
          ? { code: 0, fullData: data.fullData.toString("utf8") }
          : { code: 1, msg: "Wrong PIN" }
      );
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: err });
    });
});

/* function getselect(){//db에 있는 pin번호를 pinarray에 넣는다.
        return new Promise(function(resolve,reject){
            var data=Pin.findAll({attributes:['pin']});
            resolve(data);
        });
    }
    getselect().then(function(data) {
        var data2=JSON.stringify(data);
        console.log(data2,typeof(data2)); 
        var data3=data2.replace(/\[/gi,"").replace(/\]/gi,"").replace(/pin/gi,"")
        .replace(/\{/gi,"").replace(/\}/gi,"").replace(/\"/gi,"").replace(/\:/gi,"");
        var pinArray=data3.split(',');
        console.log(pinArray);
      });*/
module.exports = router;
