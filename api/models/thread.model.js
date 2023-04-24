const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const threadSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        messageChannelId: {
            type: Schema.Types.ObjectId, ref: "Message_channel"
        },
        //may be thread create from message image or file...
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

module.exports = mongoose.model("Thread", threadSchema);
