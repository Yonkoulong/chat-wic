const jwt = require("jsonwebtoken");
const { httpCode } = require("../utils/constant");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res
      .status(httpCode.forbidden)
      .send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env?.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(httpCode.unauthorize).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
