import { createArticleValidator } from './../validators/article.js';
import { Router } from 'express';
import {
	createArticle,
	deleteArticle,
	getArticleById,
	updateArticle,
	getAllArticles,
} from '../controllers/article.js';
import { isLoggedIn } from '../controllers/auth.js';
import isValid from '../validators/validationResult.js';

const router = Router();

router.post('/', isLoggedIn, createArticleValidator, isValid, createArticle);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.put('/:id', isLoggedIn, updateArticle);
router.delete('/:id', isLoggedIn, deleteArticle);

export default router;
