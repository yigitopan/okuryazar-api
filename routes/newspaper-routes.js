const express = require('express');
const newspaperController = require('../controllers/newspaper-controller');
const router = express.Router();

router.get('/getimages', newspaperController.getContent);

module.exports = router;