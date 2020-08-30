const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
  //로그인검사
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};
exports.isNotLoggedIn = (req, res, next) => {
  //로그인이 되어 있지 않을 때
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};
exports.verifyToken = (req, res, next) => {
  //토큰인증
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다",
      });
    }
    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다",
    });
  }
};
