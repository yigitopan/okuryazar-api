const express = require('express');
const newspaperController = require('../controllers/newspaper-controller');
const router = express.Router();

//router.get('/:newspaper', newspaperController.getContent);
router.get('/:newspaper/:subject', newspaperController.getContent);

router.get('/getallnews', newspaperController.getAllNews);

module.exports = router;