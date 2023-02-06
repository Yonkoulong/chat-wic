const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { httpCode, responseError } = require("../utils/constant");
const { isArray } = require("../utils/validation");

const postLogin = async (req, res) => {
  const { username, password } = req?.body;
  try {
    const mapUserWithUsername = await User.find({ username });
    let matchUser = {};
    if (isArray(mapUserWithUsername) && mapUserWithUsername.length > 0) {
      matchUser = mapUserWithUsername[0];
    }

    const isMatchPassword = await bcrypt.compare(
      password,
      matchUser?.password || ""
    );

    if (isMatchPassword) {
      const token = jwt.sign({ data: matchUser }, process.env.TOKEN_KEY, {
        expiresIn: "12h",
      });
      return res.status(httpCode.ok).json({ ...matchUser?._doc, token });
    } else {
      return res.status(httpCode.badRequest).json(responseError.login);
    }
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postRegister = async (req, res) => {};

module.exports = [
  { method: "post", controller: postLogin, routeName: "/login" },
  { method: "post", controller: postRegister, routeName: "/register" },
];
