const express = require('express');
const newspapersController = require('../controllers/news-controller');
const articlesController = require('../controllers/articles-controller');
const router = express.Router();

//router.get('/:newspaper', newspaperController.getContent);

router.get('/:newspaper/articles', articlesController.getContent);
router.get('/:newspaper/:subject', newspapersController.getContent);
router.get('/getallnews', newspapersController.getAllNews);

router.get('/getallarticles', articlesController.getAllArticles);

module.exports = router;