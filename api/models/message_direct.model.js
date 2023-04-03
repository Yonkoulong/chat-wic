const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageDirectSchema = new Schema(
  {
    messageFrom: { type: Schema.Types.ObjectId, ref: "User" },
    messageTo: { type: Schema.Types.ObjectId, ref: "User" },
    content: {
      type: String,
      required: false,
      trim: true,
    },
    directId: { type: String, ref: "Direct" },
    type: {
      type: String,
      required: false,
      trim: true,
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

module.exports = mongoose.model("Message_direct", messageDirectSchema);
