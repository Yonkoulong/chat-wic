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
    directId: { type: Schema.Types.ObjectId, ref: "Direct" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message_direct", messageDirectSchema);
