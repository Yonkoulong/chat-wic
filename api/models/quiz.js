const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const quizSchema = new Schema({
    category : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : false
    },
    questions : {
        type : Array, 
        required : true
    }
});

module.exports = mongoose.model("Quiz", quizSchema);