import express, { Router } from 'express';
import {scrapNews, getAllNews} from '../controllers/news-controller';
import {scrapArticles, getAllArticles} from '../controllers/articles-controller';
import {search} from '../controllers/search-controller';

const router = Router();

router.get('/get/news/all', getAllNews)
router.get('/get/articles/all', getAllArticles);
router.get('/search/:query', search);
router.get('/push/:newspaper/articles', scrapArticles);
router.get('/push/:newspaper/:subject', scrapNews);

export default router;