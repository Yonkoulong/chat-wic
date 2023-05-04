const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageThreadSchema = new Schema(
  {
    messageFrom: { type: Schema.Types.ObjectId, ref: 'User' },
    content: {
      type: String,
      required: false,
      trim: true,
    },
    threadId: { type: String, required: true },
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

module.exports = mongoose.model('Message_thread', messageThreadSchema);
