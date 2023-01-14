import express, { Router } from 'express';
import {scrapArticles, getAllArticles} from '../controllers/articles-controller';

const router = Router();

router.get('/push/:newspaper/articles', scrapArticles);
router.get('/get/articles/all', getAllArticles);

export default router;