const Quiz = require("../models/quiz");
const ObjectId = require("mongoose").Types.ObjectId;
const services = require("../utils/http");
var jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    return new Promise((resolve,reject)=>{
        jwt.verify(token,PRIVATE_KEY, (err,result)=>{
            if(err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

const getDataQuiz = async(req, res) => {
        const response = await Quiz.find({});
        let convertRes = services.convertData(response);
        return res.json(convertRes);
}

const getDataQuizWithId = async(req, res) => {
    const {params} = req;
    const bearerToken = req.headers['authorization']
    const quizId = params.quizId;
    if(!ObjectId.isValid(quizId)){
        res.json("error")
        return res.status(404);
    }

    const response = await Quiz.find({_id : quizId});

    if(!response){
        return res.status;
    }
    if(!bearerToken){
        const dataQuiz = services.convertData(response);  
        return res.json(dataQuiz);  
    }

    return res.json(response)

}

const postSubmitResult = async(req, res) => {

}

const getAllDataQuiz = async(req, res) => {
        const responseQuizzes = await Quiz.find({});
        return res.json(responseQuizzes);
}

const postQuizzes = async(req, res) => {
    const responseQuizzes = await Quiz.find({});
    return res.json(responseQuizzes);
}

module.exports = {
    getDataQuizWithId ,
    getDataQuiz,
    getAllDataQuiz,
    postQuizzes
}