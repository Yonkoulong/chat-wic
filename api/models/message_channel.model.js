const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageChannelSchema = new Schema(
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
      type: String,
      required: false,
    },
    reactions: {
      type: Array,
      required: false,
    },
    threadId: {
      type: String,
      required: false,
    },
    threadIdContainMessage: {
      type: String,
      required: false,
    },
    totalMessageInThread: {
      type: Number,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message_channel", messageChannelSchema);
