const Manager = require("../models/manager");
const ObjectId = require("mongoose").Types.ObjectId;
var jwt = require('jsonwebtoken');

const getDataManager = async(req, res, next ) => {
    const response = await Manager.find({});
    return res.json(response);
}   


module.exports = {
    getDataManager
}