import { NextFunction, Request, Response } from 'express';
import Book from '../models/Book.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import slugify from 'slugify';

// add properties to req.query
declare global {
	namespace Express {
		interface Request {
			query: {
				tags: string | string[] | undefined;
				search: string | object | undefined;
			};
		}
	}
}

export const getBooks = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { tags, search } = req.query;
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		const query = { tags, search };
		if (tags) {
			query.tags = tags;
		}
		if (search) {
			query.search = { $regex: search, $options: 'i' };
		}

		const books = await Book.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit);
		const totalBooks = await Book.countDocuments(query);
		const totalPages = Math.ceil(totalBooks / limit);

		if (page > totalPages) {
			return AppError.notFound('Page out of range');
		}

		return res.status(200).json({
			status: 'success',
			message: 'Books retrieved successfully',
			data: {
				books,
				totalBooks,
				totalPages,
				currentPage: page,
			},
		});
	}
);

// get book by id
export const getBookById = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const book = await Book.findById(req.params.id);
		return res.status(200).json({
			status: 'success',
			message: 'Book retrieved successfully',
			data: {
				book,
			},
		});
	}
);

// create book
export const createBook = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const {
			title,
			author,
			description,
			publishedDate,
			publisher,
			tags,
			averageRating = 0,
			ratingsCount = 0,
			bookCover,
		} = req.body;
		let slug = slugify.default(title, { lower: true });
		const book = await Book.create({
			title,
			author,
			description,
			publishedDate,
			publisher,
			tags,
			slug,
			averageRating,
			ratingsCount,
			bookCover,
		});
		return res.status(201).json({
			status: 'success',
			message: 'Book created successfully',
			data: {
				book,
			},
		});
	}
);

export const updateBook = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const {
			title,
			author,
			description,
			publishedDate,
			publisher,
			tags,
			bookCover,
		} = req.body;
		const _id = req.params.id;
		const bookExists = await Book.findById(_id);
		if (!bookExists) {
			return AppError.notFound('Book does not exist');
		}
		const updatedBook = await Book.findByIdAndUpdate(
			_id,
			{
				title,
				author,
				description,
				publishedDate,
				publisher,
				tags,
				bookCover,
			},
			{ new: true }
		);
		return res.status(200).json({
			status: 'success',
			message: 'Book updated successfully',
			data: {
				book: updatedBook,
			},
		});
	}
);
