const express = require('express');

const router = express.Router();

const quizController = require('../controllers/quiz');

router.get("/quizzes", quizController.getDataQuiz);

router.get("/quizzes/:quizId", quizController.getDataQuizWithId);

module.exports = router;