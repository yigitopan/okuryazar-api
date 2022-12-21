const express = require('express');
const newspapersController = require('../controllers/news-controller');
const articlesController = require('../controllers/articles-controller');
const searchController = require('../controllers/search-controller');
const router = express.Router();

const quatsch = require('../controllers/nonproject-stuff.js');

router.get('/get/news/all', newspapersController.getAllNews);
router.get('/get/articles/all', articlesController.getAllArticles);
router.get('/search/:query', searchController.searchOkuryazar);
router.get('/push/:newspaper/articles', articlesController.getContent);
router.get('/push/:newspaper/:subject', newspapersController.getContent);
router.get('/get/dbtest', articlesController.getNewspapersTest);
router.get('/get/mail', quatsch.MindSetEmail);

module.exports = router;