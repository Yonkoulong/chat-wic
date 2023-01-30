const express = require('express');

const router = express.Router();

const sessionTableController = require("../controllers/sessionTable");

router.get("/sessions/:sessionId", sessionTableController.getDataSessionTable);
router.get('/sessions', sessionTableController.getAllDataSession);
router.post("/post-sessions", sessionTableController.postCreateSessionTable)

module.exports = router;