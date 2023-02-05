const User = require("../models/user.model");
const { httpCode, responseError } = require("../utils/constant");
const { isArray } = require("../utils/validation");
const bcrypt = require("bcrypt");

const postLogin = async (req, res) => {
  const { account, password } = req?.body;
  try {
    const mapUserWithAccount = await User.find({ account });
    let matchUser = {};
    if (isArray(mapUserWithAccount) && mapUserWithAccount.length > 0) {
      matchUser = mapUserWithAccount[0];
    }

    const isMatchPassword = await bcrypt.compare(
      matchUser?.password || "",
      password
    );

    if (isMatchPassword) {
      return res.status(httpCode.ok).json(matchUser);
    } else {
      return res.status(httpCode.badRequest).json(responseError.login);
    }
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

module.exports = [
  { method: "post", controller: postLogin, routeName: "/login" },
];
