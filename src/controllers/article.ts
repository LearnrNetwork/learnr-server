import catchAsync from '../utils/catchAsync.js';
import { Request, Response, NextFunction } from 'express';
import Article from '../models/entities/Article.js';
import uniqueSlug from '../utils/uniqueSlug.js';
import AppError from '../utils/AppError.js';

// create article
export const createArticle = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, content, tags, parent } = req.body;
		const author = req.user._id;
		const slug = uniqueSlug(title);
		const article = await Article.create({
			title,
			content,
			tags,
			slug,
			parent,
			author,
		});
		return res.status(201).json({
			status: 'success',
			message: 'Article created successfully',
			data: {
				article,
			},
		});
	}
);

// get article by id
export const getArticleById = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		const article = await Article.findById(id);
		if (!article) {
			return next(AppError.notFound('Not found'));
		}
		return res.status(200).json({
			status: 'success',
			message: 'Article retrieved successfully',
			data: {
				article,
			},
		});
	}
);

// update article
export const updateArticle = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		const { title, content, tags, slug, parent, author } = req.body;
		const articleExists = await Article.findById(id);
		if (!articleExists) {
			return next(AppError.badRequest('Article does not exist'));
		}
		const article = await Article.findByIdAndUpdate(id, {
			title,
			content,
			tags,
			parent,
			author,
		});
		return res.status(200).json({
			status: 'success',
			message: 'Article updated successfully',
			data: {
				article,
			},
		});
	}
);

// delete article
export const deleteArticle = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		// check if article exists
		const articleExists = await Article.findById(id);
		if (!articleExists) {
			return next(AppError.badRequest('Article does not exist'));
		}
		// delete article
		await Article.findByIdAndDelete(id);
		return res.status(200).json({
			status: 'success',
			message: 'Article deleted successfully',
		});
	}
);

// get all articles
export const getAllArticles = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const articles = await Article.find();
		if (articles.length == 0) {
			return next(AppError.notFound('No articles found'));
		}
		return res.status(200).json({
			status: 'success',
			message: 'Articles retrieved successfully',
			data: {
				articles,
			},
		});
	}
);
