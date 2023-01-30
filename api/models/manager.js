const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const managerSchema = new Schema({
    account : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : false
    },
    mastership : {
        type : Boolean, 
        required : true
    }
});

module.exports = mongoose.model("Manager", managerSchema);