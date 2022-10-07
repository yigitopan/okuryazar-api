const express = require('express');
const newspaperController = require('../controllers/newspaper-controller');
const router = express.Router();

router.get('/getcontent', newspaperController.getContent);

module.exports = router;