const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const threadSchema = new Schema(
    {
        messageChannelId : {
            type: Schema.Types.ObjectId, ref: "Message_channel"
        },
        threadName: {
            type: String,
            required: true,
        },
        totalMemberJoinThread: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Thread", threadSchema);
