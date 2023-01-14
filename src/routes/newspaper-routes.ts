import express, { Router } from 'express';
import {getByNewspaper} from '../controllers/news-controller';

const router = Router();
router.get('/get/both/:newspaper', getByNewspaper)         

export default router;