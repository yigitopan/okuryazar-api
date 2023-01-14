import express, { Router } from 'express';
import {search} from '../controllers/search-controller';

const router = Router();

router.get('/search/:query', search);

export default router;