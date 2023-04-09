const MessageChannel = require("../models/message_channel.model");
const User = require("../models/user.model");
const {
  httpCode,
  responseError,
  ORDER_DIRECTION,
  ObjectIdMongodb,
  formatResponse,
  isArray,
  MESSAGE_TYPES,
  responseConstant,
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
  const { channelId } = req?.params;
  const {
    content,
    messageFrom,
    type,
    replyId,
    url,
    secretUrl,
    fileName,
    size,
    senderName
  } = req.body;

  if (isObjectIdInMongodb(channelId) && isObjectIdInMongodb(messageFrom)) {
    const convertMessageFromToObjectIdMongo = ObjectIdMongodb(messageFrom);
    const convertChannelIdToObjectIdMongo = ObjectIdMongodb(channelId);
    const messageId = new ObjectIdMongodb();
    const newMessage = {
      _id: messageId,
      messageFrom: convertMessageFromToObjectIdMongo,
      senderName: senderName,
      content,
      channelId: convertChannelIdToObjectIdMongo,
      type: type || MESSAGE_TYPES.PLAIN_TEXT,
      replyId: replyId || "",
      reactions: [],
      threadIdContainMessage: "",
      threadId: ""
    };

    if (type === MESSAGE_TYPES.IMAGE) {
      newMessage.srcImage = content;
    }

    if (type === MESSAGE_TYPES.RAW) {
      if (!!url) newMessage.url = url;
      if (!!secretUrl) newMessage.secretUrl = secretUrl;
      if (!!fileName) newMessage.secretUrl = fileName;
      if (!!size) newMessage.secretUrl = size;
    }

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
  // filter reply ids
  const replyIds = messageInChannel
    ?.filter((item) => item?.replyId)
    ?.map((item) => item.replyId);

  let messageByReplyIds = [];
  try {
    // get messages by ids
    messageByReplyIds = await MessageChannel.find({ _id: { $in: replyIds } });
  } catch {}
  const senders = await User.find({ _id: { $in: senderIds } });
  const convertMessageInChannel = messageInChannel?.map((message) => {
    const senderIdToString = message?.messageFrom?.toString();
    let senderName = "";
    let avatar = "";
    let replyMessage = {};
    senders?.forEach((sender) => {
      if (senderIdToString === sender?._id?.toString()) {
        senderName = sender?.username || "";
        avatar = sender?.avatar;
      }
    });
    // get message reply
    if (message?.replyId && messageByReplyIds?.length > 0) {
      messageByReplyIds?.forEach((item) => {
        if (item?._id?.toString() == message?.replyId) {
          replyMessage = item;
        }
      });
    }

    return { ...message?._doc, senderName, avatar, replyMessage };
  });

  return res.status(httpCode.ok).json(formatResponse(convertMessageInChannel));
};

// get message by thread id

const getMessagesByThreadId = async (req, res) => {
  const { threadId } = req?.params;
  try {
    const message = await MessageChannel?.find({
      threadId,
      threadIdContainMessage: threadId,
    });
    return res.json(message);
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const putUpdateMessageChannel = async (req, res) => {
  const { content, reaction } = req?.body;
  const { messageId } = req?.params;

  try {
    const messageById = await MessageChannel.find({ _id: messageId });

    let messageData = {};
    if (messageById?.length < 1) {
      return res?.status(httpCode.notFound).json(responseError.notFound);
    }
    messageData = {
      ...messageById[0]?._doc,
      content: content || messageById[0]?._doc?.content,
    };

    let messageReactions = messageData?.reactions || [];

    const isWillRemoveReaction =
      messageReactions?.filter((item) => {
        return (
          item?.unified?.toString() === reaction?.unified?.toString() &&
          reaction?.reactorId === reaction?.reactorId
        );
      })?.length > 0;

    const isNewReaction =
      Array.isArray(messageReactions) && messageReactions?.length < 1;

    console.log(isWillRemoveReaction, "isWillRemoveReaction");

    if (isNewReaction) {
      // add new reaction
      messageReactions?.push(reaction);
    } else if (isWillRemoveReaction) {
      // remove reaction has existed
      messageReactions = messageReactions?.filter(
        (item) =>
          item?.unified !== reaction?.unified &&
          reaction?.reactorId !== reaction?.reactorId
      );
    } else {
      // update new reaction
      messageReactions = messageReactions?.map((item) => {
        const reactorId = reaction?.reactorId;
        let newItem = item;
        // check already exist reactorId
        if (reactorId === item?.reactorId) {
          newItem = reaction;
        }
        return newItem;
      });
    }

    messageData = { ...messageData, reactions: messageReactions };

    await MessageChannel.updateOne(
      { _id: messageId },
      { $set: messageData, $currentDate: { lastUpdated: true } }
    );

    return res?.status(httpCode.ok).json(formatResponse(messageData));
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const deleteMessageInChannel = async (req, res) => {
  const { messageId } = req?.params;

  try {
    await MessageChannel.deleteOne({ _id: messageId });
    return res
      .status(httpCode.ok)
      .json(responseConstant.deleteMessageSuccessfully);
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postCreateThreadAndAddMessageToThread = async (req, res) => {
  const { threadId } = req?.params;
  const { content, messageFrom, type } = req.body;
  let isThreadMessageExisted = false;
  let messageRoot = {};
  let totalMessageInThread = 0;
  let threadMessageExisted = [];

  try {
    threadMessageExisted = await MessageChannel.find({
      threadId,
      threadIdContainMessage: threadId,
    });
    isThreadMessageExisted = threadMessageExisted?._doc?.length > 0;
  } catch {}

  if (isThreadMessageExisted) {
    // add message in thread and update total message in thread;

    // count message in thread when thread already exit
    totalMessageInThread = (threadMessageExisted?.length || 0) + 1;
    if (
      threadMessageExisted?._doc?.filter((item) => item?.threadId === threadId)
        ?.length > 0
    ) {
      messageRoot = threadMessageExisted?._doc?.filter(
        (item) => item?.threadId === threadId
      )[0];
    }
  } else {
    // create thread and // count message in thread when thread already exit
    totalMessageInThread = 2; // messageRoot and child message request
    const messageRootData = await MessageChannel.find({ _id: threadId });
    if (messageRootData?.length > 0) {
      messageRoot = { ...messageRootData[0]?._doc };
    } else {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }

  // update total message in thread
  // try catch to check error
  try {
    await MessageChannel.updateOne(
      { _id: threadId },
      {
        $set: { ...messageRoot, totalMessageInThread, threadId },
        $currentDate: { lastUpdated: true },
      }
    );
  } catch {}

  // add new message in thread
  const newMessage = {
    content,
    type,
    messageFrom,
    threadIdContainMessage: threadId,
    threadId: "",
  };

  try {
    await MessageChannel.create(newMessage);
    return res?.status(httpCode.ok).json(newMessage);
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

// search member and channel by organizeId
const postSearchMemberAndChannelByOrganizeId = async (req, res) => {};

module.exports = [
  {
    method: "get",
    controller: getMessagesChannel,
    routeName: "/messages-channel",
  },
  {
    method: "post",
    controller: postMessageChannel,
    routeName: "/message-channel/:channelId/create",
  },
  {
    method: "post",
    controller: getMessageChannelByChannelId,
    routeName: "/message-channel/:channelId",
  },
  {
    method: "post",
    controller: getMessagesByThreadId,
    routeName: "/message-channel/:threadId",
  },
  {
    method: "put",
    controller: putUpdateMessageChannel,
    routeName: "/message-channel/:messageId",
  },
  {
    method: "delete",
    controller: deleteMessageInChannel,
    routeName: "/message-channel/:messageId/delete",
  },
  {
    method: "post",
    controller: postCreateThreadAndAddMessageToThread,
    routeName:
      "/message-channel/:threadId/create-thread-and-add-message-to-thread",
  },
  {
    method: "post",
    controller: postSearchMemberAndChannelByOrganizeId,
    routeName: "/member-and-channel/:organizeId/search",
  },
];
