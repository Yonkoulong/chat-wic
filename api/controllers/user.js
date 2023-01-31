const User = require("../models/user");

const getUsers = async (_req, res) => {
  //create an array of documents
  const users = await User.find({});

  return res.json(users);
};

const getUserDetail = async (_req, res) => {
  //create an array of documents
  const users = await User.find({});

  return res.json(users);
};

module.exports = [
  {
    method: "get",
    controller: getUsers,
    routeName: "/users",
  },
];
