const User = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
var jwt = require('jsonwebtoken');

const getDataUser = async(req, res) => {
    const users = User.find({})
}


module.exports = {
    getDataUser
}