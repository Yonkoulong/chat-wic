const Message = require("../models/message");
const MongoDB = require("mongodb");
const { httpCode, responseError } = require("../utils/constant");
const { isObjectIdInMongodb } = require("../utils/validation");

const ObjectIdMongodb = MongoDB.ObjectId;

const getMessages = async (_req, res) => {
  //create an array of documents
  try {
    const message = await Message?.find({});
    return res.json(message);
  } catch {
    return res.json([]);
  }
};

const postMessage = async (req, res) => {
  const { content, roomId, senderId } = req.body;

  if (isObjectIdInMongodb(roomId) && isObjectIdInMongodb(senderId)) {
    const convertSenderId = ObjectIdMongodb(senderId);
    const convertRoomId = ObjectIdMongodb(roomId);
    const newMessage = {
      senderId: convertSenderId,
      content,
      roomId: convertRoomId,
    };

    try {
      await Message.create(newMessage);
      return res?.status(httpCode.ok).json(newMessage);
    } catch {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

module.exports = [
  { method: "get", controller: getMessages, routeName: "/messages" },
  { method: "post", controller: postMessage, routeName: "/message/create" },
];
