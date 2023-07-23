import { Router } from 'express';
import {
	createArticle,
	deleteArticle,
	getArticleById,
	updateArticle,
} from '../controllers/article.js';
import { isLoggedIn } from '../controllers/auth.js';

const router = Router();

router.post('/', isLoggedIn, createArticle);
router.get('/:id', getArticleById);
router.put('/:id', isLoggedIn, updateArticle);
router.delete('/:id', isLoggedIn, deleteArticle);

export default router;
