import slugify from 'slugify';
import { Request, Response, NextFunction } from 'express';
import Tag from '../models/entities/Tag.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// create tags
export const createTag = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, description } = req.body;
		let slug = slugify.default(name, { lower: true, trim: true });
		// check if the tag exists
		const tagExists = await Tag.findOne({ slug });
		if (tagExists) {
			return next(AppError.badRequest('Tag already exists'));
		}
		const tagDocs = await Tag.create({ name, description, slug });
		return res.status(201).json({
			status: 'success',
			message: 'Tag created successfully',
			data: {
				tags: tagDocs,
			},
		});
	}
);

export const getAllTags = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const tags = await Tag.find();
		return res.status(200).json({
			status: 'success',
			message: 'Tags retrieved successfully',
			data: {
				tags,
			},
		});
	}
);
