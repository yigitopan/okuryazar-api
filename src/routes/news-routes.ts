import express, { Router } from 'express';
import {scrapNews, getAllNews, getByCategory} from '../controllers/news-controller';

const router = Router();

router.get('/get/news/all', getAllNews)         
router.get('/get/category/:category', getByCategory)         
router.get('/push/:newspaper/:subject', scrapNews);




export default router;