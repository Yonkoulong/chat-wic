const express = require('express');

const router = express.Router();

const managerController = require('../controllers/manager');

router.get("/managers", managerController.getDataManager);

module.exports = router;
