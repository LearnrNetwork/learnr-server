import { body } from 'express-validator';

export const createArticleValidator = [
	body('title').trim().notEmpty().withMessage('Title is required'),
	body('content').trim().notEmpty().withMessage('Content is required'),
	body('tags').isLength({ min: 1 }).withMessage('Tags is required'),
	body('parent')
		.optional()
		.isMongoId()
		.withMessage('Parent must be a valid id'),
];
