const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Organize = require("../models/organize.model");
const {
  httpCode,
  responseError,
  saltRounds,
  IUserStatus,
  ObjectIdMongodb,
  USER_ROLES
} = require("../utils/constant");
const { isArray } = require("../utils/validation");

const postLogin = async (req, res) => {
  const { email, password } = req?.body;
  try {
    const mapUserWithEmail = await User.find({ email });
    let matchUser = {};
    if (isArray(mapUserWithEmail) && mapUserWithEmail.length > 0) {
      matchUser = mapUserWithEmail[0];
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

const postRegister = async (req, res) => {
  const { organizeName, email, password } = req?.body;

  if (!organizeName && !email && !password) {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }

  const getOrganize = await Organize.find({ organizeName });

  if (isArray(getOrganize) && getOrganize.length > 0) {
    return res
      .status(httpCode.badRequest)
      .json(responseError.organizeAlreadyExist);
  }

  const getEmail = await User.find({ email });

  if (isArray(getEmail) && getEmail.length > 0) {
    return res
      .status(httpCode.badRequest)
      .json(responseError.emailAlreadyExist);
  }

  const convertPassword = await bcrypt.hash(password, saltRounds);
  const _id = new ObjectIdMongodb();
  const newUser = {
    _id,
    email,
    password: convertPassword,
    userStatus: IUserStatus.offline,
    username: "",
    avatar: "",
    firstName: "",
    lastName: "",
    role : USER_ROLES.admin
  };

  try {
    await User?.create(newUser);
  } catch (err) {
    if (err) {
      return res.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }

  const newOrganize = {
    organizeName,
    ownerId: _id,
    active: true,
  };

  try {
    await Organize.create(newOrganize);
    return res.status(httpCode.ok).json(newOrganize);
  } catch {
    return res
      .status(httpCode.badRequest)
      .json(responseError.createOrganizeError);
  }
};

module.exports = [
  { method: "post", controller: postLogin, routeName: "/login" },
  { method: "post", controller: postRegister, routeName: "/organize/register" },
];
