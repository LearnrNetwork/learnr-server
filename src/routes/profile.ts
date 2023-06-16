import { Router } from 'express';
import {
	createProfile,
	updateProfile,
	getProfile,
} from '../controllers/profile.js';
import { isAuthorized, isLoggedin } from '../controllers/auth.js';

const router = Router();

router.post('/:user', isLoggedin, createProfile);
router.get('/:user', getProfile);
router.put('/:user', isLoggedin, isAuthorized, updateProfile);

export default router;
