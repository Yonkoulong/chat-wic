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
  USER_ROLES,
  minLengthPassword,
} = require("../utils/constant");
const { isArray } = require("../utils/validation");

const postLogin = async (req, res) => {
  const { email, password } = req?.body;
  try {
    const mapUserWithEmail = await User.find({ email });
    let matchUser = {};
    if (isArray(mapUserWithEmail) && mapUserWithEmail.length > 0) {
      // remove avatar on token
      matchUser = { ...mapUserWithEmail[0]?._doc, avatar: "" };
    }

    const isMatchPassword = await bcrypt.compare(
      password,
      matchUser?.password || ""
    );

    if (isMatchPassword) {
      const token = jwt.sign({ data: matchUser }, process.env.TOKEN_KEY, {
        expiresIn: "24h",
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

  if (password?.length < minLengthPassword) {
    return res.status(httpCode.badRequest).json(responseError.lengthPassword);
  }

  const organizationWithOrganizeName = await Organize.find({ organizeName });

  if (
    isArray(organizationWithOrganizeName) &&
    organizationWithOrganizeName.length > 0
  ) {
    return res
      .status(httpCode.badRequest)
      .json(responseError.organizeAlreadyExist);
  }

  const userWithEmail = await User.find({ email });

  if (isArray(userWithEmail) && userWithEmail.length > 0) {
    return res
      .status(httpCode.badRequest)
      .json(responseError.emailAlreadyExist);
  }

  const convertPassword = await bcrypt.hash(password, saltRounds);
  const _id = new ObjectIdMongodb();
  const organizeId = new ObjectIdMongodb();
  const newUser = {
    _id,
    email,
    password: convertPassword,
    userStatus: IUserStatus.offline,
    username: "",
    avatar: "",
    firstName: "",
    lastName: "",
    role: USER_ROLES.admin,
    organizeId,
  };

  try {
    await User?.create(newUser);
  } catch (err) {
    if (err) {
      return res.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }

  const newOrganize = {
    _id: organizeId,
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
