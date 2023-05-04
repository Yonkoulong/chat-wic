const MessageThread = require('../models/message_thread.model');
const MessageChannel = require('../models/message_channel.model');
const User = require('../models/user.model');

const { isObjectIdInMongodb } = require('../utils/validation');
const {
  ObjectIdMongodb,
  MESSAGE_TYPES,
  httpCode,
  responseError,
  responseConstant,
} = require('../utils/constant');

const postMessageThread = async (req, res) => {
  const { messageChannelId } = req?.params;
  const {
    content,
    messageFrom,
    type,
    replyId,
    threadId,
    url,
    secretUrl,
    fileName,
    size,
    senderName,
    senderAvatar,
  } = req?.body;

  if (isObjectIdInMongodb(messageFrom)) {
    const convertMessageFromToObjectIdMongo = isObjectIdInMongodb(messageFrom);

    const messageThreadId = new ObjectIdMongodb();

    const newMessageThread = {
      _id: messageThreadId,
      messageFrom: convertMessageFromToObjectIdMongo,
      content,
      type: type || MESSAGE_TYPES.PLAIN_TEXT,
      replyId: replyId || '',
      threadId: threadId || '',
      replyMessage: {},
      reactions: [],
    };

    try {

      const messageChannelDetail = await MessageChannel.find({
        _id: messageChannelId,
      });

      if (!threadId && !messageChannelDetail[0]?.threadId) {
        //update message channel
        const newMessageChannel = { ...messageChannelDetail[0]?._doc, threadId: messageChannelId }

        await MessageChannel.updateOne(
          { _id: messageChannelId }, {
          $set: newMessageChannel,
          $currentDate: { lastUpdated: true },
        }
        )
      }

      //create message thread
      if (type === MESSAGE_TYPES.IMAGE) {
        newMessageThread.srcImage = content;
      }

      if (type === MESSAGE_TYPES.RAW) {
        if (!!url) newMessageThread.url = url;
        if (!!secretUrl) newMessageThread.fileName = fileName;
        if (!!size) newMessageThread.size = size;
      }

      let messageByReplyIds = {};
      let senderInReply = {};

      if (!isObjectEmpty(replyId)) {
        messageByReplyIds = await MessageChannel.find({ _id: { $in: replyId } })
        if (messageByReplyIds.length > 0) {
          senderInReply = await User.find({ _id: { $in: messageByReplyIds[0].messageFrom } });

          if (senderInReply.length > 0) {
            messageByReplyIds = { ...messageByReplyIds['0']?._doc, senderName: senderInReply[0].username };
          }
        }
      }

      //create Message thread
      await MessageThread.create(newMessageThread);

      if (messageByReplyIds.length > 0) {
        return res?.status(httpCode.oke).json({ ...newMessageThread, replyIdMessage: messageByReplyIds, senderName: senderName, avatar: senderAvatar });
      } else {
        return res?.status(httpCode.oke).json({ ...newMessageThread, senderName: senderName, avatar: senderAvatar });
      }

    } catch (error) { }
  }
};

const putUpdateMessageThread = async (req, res) => {

}

const deleteMessageThread = async (req, res) => {
  const { messageThreadId } = req?.params;

  try {
    await MessageThread.deleteOne({ _id: messageThreadId });
    return res
      .status(httpCode.ok)
      .json(responseConstant.deleteMessageSuccessfully);
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
}

module.exports = [
  {
    method: 'post',
    controller: postMessageThread,
    routeName: '/message-thread/:messageChannelId/create',
  },
  {
    method: 'put',
    controller: putUpdateMessageThread,
    routeName: '/message-thread/:messageThreadId/update',
  },
  {
    method: 'delete',
    controller: deleteMessageThread,
    routeName: '/message-thread/:messageThreadId/delete',
  },
];
