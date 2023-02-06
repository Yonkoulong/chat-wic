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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message_channel", messageChannelSchema);
