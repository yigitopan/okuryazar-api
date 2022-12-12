const express = require('express');
const newspapersController = require('../controllers/news-controller');
const articlesController = require('../controllers/articles-controller');
const searchController = require('../controllers/search-controller');
const router = express.Router();


// yazılacak router.get('/get/article/:articleid', articlesController.getArticleById);


//GetAll
router.get('/get/news/all', newspapersController.getAllNews);
router.get('/get/articles/all', articlesController.getAllArticles);

//SearchQueries
router.post('/search', searchController.searchOkuryazar);


// Die Endpoints unten werden nur an server-side ausgeführt, um die Datenbank zu aktualisieren.
router.get('/push/:newspaper/articles', articlesController.getContent);
router.get('/push/:newspaper/:subject', newspapersController.getContent);

//Test
router.get('/get/dbtest', articlesController.getNewspapersTest);




module.exports = router;