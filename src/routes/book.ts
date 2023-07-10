import { Router } from 'express';
import {
	getBooks,
	getBookById,
	createBook,
	updateBook,
} from '../controllers/book.js';
import { isLoggedIn } from '../controllers/auth.js';

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', isLoggedIn, createBook);
router.put('/:id', isLoggedIn, updateBook);

export default router;
