const res = require("express/lib/response");
const SessionTable = require("../models/sessionTable");
const ObjectId = require("mongoose").Types.ObjectId;

const getDataSessionTable = async (req, res) => {
    const {params} = req;
    const sessionId = params.sessionId;
    if(!ObjectId(sessionId)){
        return res.json([]);
    }

    const dataSessionTable = await SessionTable.find({_id : sessionId});

    return res.json(dataSessionTable);
}

const getAllDataSession = async(req, res) => {
    const dataSessionTable = await SessionTable.find({});

    return res.json(dataSessionTable);
}

const postCreateSessionTable = (req, res) => {
    console.log("post body", req.body);
    return res.json({data:1});
}

module.exports = {
    getDataSessionTable,
    getAllDataSession,
    postCreateSessionTable
}