const Message = require("../models/message");

const getMessages = async (_req, res) => {
  //create an array of documents
  const message = await Message.find({});

  return res.json(message);
};

module.exports = [
  { method: "get", controller: getMessages, routeName: "/messages" },
];
