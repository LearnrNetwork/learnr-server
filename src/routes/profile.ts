import { Router } from 'express';
import {
	createProfile,
	updateProfile,
	getProfile,
} from '../controllers/profile.js';
import { isAuthorized, isLoggedIn } from '../controllers/auth.js';

const router = Router();

router.post('/:user', isLoggedIn, createProfile);
router.get('/:user', getProfile);
router.put('/:user', isLoggedIn, isAuthorized, updateProfile);

export default router;
