import express, { Router } from 'express';
import {getAuthors, getArticlesOfAuthor} from '../controllers/authors-controller';

const router = Router();

router.get('/get/authors', getAuthors);
router.get('/get/articles/author/:fullname', getArticlesOfAuthor);

export default router;