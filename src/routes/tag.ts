import Router from 'express';
import { createTag, getAllTags } from '../controllers/tag.js';

const router = Router();

router.get('/', getAllTags);
router.post('/', createTag);

export default router;
