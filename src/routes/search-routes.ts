import express, { Router } from 'express';
import {search, dataEndpoint} from '../controllers/search-controller';

const router = Router();

router.get('/search/:query', search);
router.get('/geneticalgo', dataEndpoint);

export default router;