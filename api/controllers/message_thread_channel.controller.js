const MessageThread = require("../models/message_thread.model");
const ThreadChannel = require("../models/thread.model");
const MessageChannel = require("../models/message_channel.model");
const User = require("../models/user.model");

const { isObjectIdInMongodb } = require("../utils/validation");
const { ObjectIdMongodb } = require("../utils/constant");

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
        senderAvatar
      } = req?.body;

    if(isObjectIdInMongodb(messageFrom)) {
        const convertMessageFromToObjectIdMongo = isObjectIdInMongodb(messageFrom);

        const threadChannelId = new ObjectIdMongodb()
        const messageThreadId = new ObjectIdMongodb();

        try {
            const messageChannelDetail = await MessageChannel.find({ _id: messageChannelId })
    
            if(!threadId && !messageChannelDetail[0]?.threadId) {
                
            } 
        
        } catch (error) {
            
        }
    }
}


module.exports = [
    {
        method: "post",
        controller: postMessageThread,
        routeName: "/message-thread/:messageId/create"
    }
]