const MessageChannel = require("../models/message_channel.model");
const User = require("../models/user.model");
const {
  httpCode,
  responseError,
  ORDER_DIRECTION,
  ObjectIdMongodb,
} = require("../utils/constant");
const { isObjectIdInMongodb } = require("../utils/validation");

const getMessagesChannel = async (_req, res) => {
  try {
    const message = await MessageChannel?.find({});
    return res.json(message);
  } catch {
    return res.json([]);
  }
};

const postMessageChannel = async (req, res) => {
  const { content, channelId, messageFrom } = req.body;

  if (isObjectIdInMongodb(channelId) && isObjectIdInMongodb(messageFrom)) {
    const convertMessageFromToObjectIdMongo = ObjectIdMongodb(messageFrom);
    const convertChannelIdToObjectIdMongo = ObjectIdMongodb(channelId);
    const newMessage = {
      senderId: convertMessageFromToObjectIdMongo,
      content,
      roomId: convertChannelIdToObjectIdMongo,
    };

    try {
      await MessageChannel.create(newMessage);
      return res?.status(httpCode.ok).json(newMessage);
    } catch {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

const getMessageChannelByChannelId = async (req, res) => {
  const { channelId } = req?.params;
  if (!channelId)
    return res?.status(httpCode.badRequest).json(responseError.badRequest);

  const { paging } = req?.body;
  const orderCreatedAt = paging?.orders?.createdAt;

  let messageInChannel = [];

  if (isObjectIdInMongodb(channelId)) {
    if (!!paging) {
      const { page, size } = paging;
      const numberToSkip = (page - 1) * size;
      messageInChannel = await MessageChannel.find({ channelId })
        .sort({ createdAt: ORDER_DIRECTION[orderCreatedAt || "DESC"] })
        .skip(numberToSkip)
        .limit(paging?.size || 10);
    } else {
      messageInChannel = await MessageChannel.find({ channelId });
    }
  }

  const senderIds = messageInChannel?.map((message) => {
    if (isObjectIdInMongodb(message?.messageFrom)) {
      return ObjectIdMongodb(message.messageFrom);
    }
  });
  const senders = await User.find({ _id: { $in: senderIds } });
  const convertMessageInChannel = messageInChannel?.map((message) => {
    const senderIdToString = message?.messageFrom?.toString();
    let senderName = "";
    senders?.forEach((sender) => {
      if (senderIdToString === sender?._id?.toString()) {
        senderName = sender?.username || "";
      }
    });

    return { ...message?._doc, senderName };
  });

  return res.status(httpCode.ok).json(convertMessageInChannel);
};

module.exports = [
  {
    method: "get",
    controller: getMessagesChannel,
    routeName: "/messages-channel",
  },
  {
    method: "post",
    controller: postMessageChannel,
    routeName: "/message-channel/create",
  },
  {
    method: "post",
    controller: getMessageChannelByChannelId,
    routeName: "/message-channel/:channelId",
  },
];
