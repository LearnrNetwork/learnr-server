import { Router } from 'express';
import {
	signup,
	signin,
	currentUser,
	isLoggedIn,
} from '../controllers/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', signin);
router.post('/current-user', isLoggedIn, currentUser);

export default router;
