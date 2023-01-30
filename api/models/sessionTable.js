const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionTableSchema = new Schema({
    timeStart : {
        type : String, 
        required : true
    },
    timeEnd : {
        type : String,
        required : true
    },
    timeChallenge : {
        type : String,
        required : true
    }
    ,
    topicId : {
        type : String,
        required : true
    },
    participant : {
        type : Array,
        require : true
    }
});

module.exports = mongoose.model("SessionTable", sessionTableSchema);
