const MessageDirect = require("../models/message_direct.model");
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

const postCreateMessageDirect = async (req, res) => {
  console.log(req?.params);
  console.log(req?.body);
  const { directId } = req?.params;
  const { content, messageFrom, type, replyId, url, secretUrl } = req?.body;

  if (isObjectIdInMongodb(directId) && isObjectIdInMongodb(messageFrom)) {
    const convertMessageFromToObjectIdMongo = ObjectIdMongodb(messageFrom);
    const convertDirectIdToObjectIdMongo = ObjectIdMongodb(directId);
    const messageId = new ObjectIdMongodb();
    const newMessage = {
      _id: messageId,
      messageFrom: convertMessageFromToObjectIdMongo,
      content,
      directId: convertDirectIdToObjectIdMongo,
      type: type || MESSAGE_TYPES.PLAIN_TEXT,
      replyId: replyId || "",
      reactions: [],
    };

    if (type === MESSAGE_TYPES.IMAGE) {
      newMessage.srcImage = content;
    }

    if (type === MESSAGE_TYPES.LINK) {
      newMessage.url = url;
      newMessage.secretUrl = secretUrl;
    }

    try {
      await MessageDirect.create(newMessage);
      return res?.status(httpCode.ok).json(newMessage);
    } catch {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

const postGetMessageDirectByDirectId = async (req, res) => {
  const { directId } = req?.params;
  if (!directId)
    return res?.status(httpCode.badRequest).json(responseError.badRequest);

  const { paging } = req?.body;
  const orderCreatedAt = paging?.orders?.createdAt;

  let messageInDirect = [];

  if (isObjectIdInMongodb(directId)) {
    if (!!paging) {
      const { page, size } = paging;
      const numberToSkip = (page - 1) * size;
      messageInDirect = await MessageDirect.find({ directId })
        .sort({ createdAt: ORDER_DIRECTION[orderCreatedAt || "DESC"] })
        .skip(numberToSkip)
        .limit(paging?.size || 10);
    } else {
      messageInDirect = await MessageDirect.find({ directId });
    }
  }

  const senderIds = messageInDirect?.map((message) => {
    if (isObjectIdInMongodb(message?.messageFrom)) {
      return ObjectIdMongodb(message.messageFrom);
    }
  });
  // filter reply ids
  const replyIds = messageInDirect
    ?.filter((item) => item?.replyId)
    ?.map((item) => item.replyId);

  let messageByReplyIds = [];
  try {
    // get messages by ids
    messageByReplyIds = await MessageDirect.find({ _id: { $in: replyIds } });
  } catch {}
  const senders = await User.find({ _id: { $in: senderIds } });
  const convertMessageInDirect = messageInDirect?.map((message) => {
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

  return res.status(httpCode.ok).json(formatResponse(convertMessageInDirect));
};

const putUpdateMessageDirect = async (req, res) => {
  const { content, reaction } = req?.body;
  const { messageId } = req?.params;

  try {
    const messageById = await MessageDirect.find({ _id: messageId });

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

    console.log("MessageData", messageData);

    await MessageDirect.updateOne(
      { _id: messageId },
      { $set: messageData, $currentDate: { lastUpdated: true } }
    );

    return res?.status(httpCode.ok).json(formatResponse(messageData));
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const deleteMessageInDirect = async (req, res) => {
  const { messageId } = req?.params;

  try {
    await MessageDirect.deleteOne({ _id: messageId });
    return res
      .status(httpCode.ok)
      .json(responseConstant.deleteMessageSuccessfully);
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

module.exports = [
  {
    method: "post",
    controller: postCreateMessageDirect,
    routeName: "/message-direct/:directId/create",
  },
  {
    method: "post",
    controller: postGetMessageDirectByDirectId,
    routeName: "/message-direct/:directId/messages",
  },
  {
    method: "put",
    controller: putUpdateMessageDirect,
    routeName: "/message-direct/:messageId/update-message",
  },
  {
    method: "delete",
    controller: deleteMessageInDirect,
    routeName: "/message-direct/:messageId/delete",
  },
];
