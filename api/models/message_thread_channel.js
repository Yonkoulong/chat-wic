const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageThreadChannelSchema = new Schema(
  {
    messageFrom: { type: Schema.Types.ObjectId, ref: "User" },
    content: {
      type: String,
      required: false,
      trim: true,
    },
    channelId: { type: Schema.Types.ObjectId, ref: "Channel" },
    type: {
      type: String,
      required: false,
      trim: true, //LINK, PLAIN-TEXT, PARAGRAPH, IMAGE
    },
    srcImage: {
      type: Buffer,
      required: false,
    },
    replyId: {
      type: String,
      required: false,
    },
    threadId: {
      type: Schema.Types.ObjectId, ref: "Thread"
    },
    reactions: {
      type: Array,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    secretUrl: {
      type: String,
      required: false,
    },
    fileName: {
      type: String,
      required: false,
    },
    size: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message_thread_channel", messageThreadChannelSchema);
