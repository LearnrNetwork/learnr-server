import { NextFunction, Request, Response } from 'express';
import Book from '../models/entities/Book.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import uniqueSlug from '../utils/uniqueSlug.js';
import Tag from '../models/entities/Tag.js';
import slugify from 'slugify';
// add properties to req.query
declare global {
	namespace Express {
		interface Request {
			query: {
				tags?: string;
				search?: string | object;
			};
		}
	}
}

// get all the book with pagination and search with tags query
// query params can have tags and search
export const getBooks = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { tags, search } = req.query;
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		// manipulate the query if it has tags or search
		// if not tags or search, return all the books
		const query = { tags, search };
		if (tags) {
			// generate id of the tags
			const tagsIds = await Promise.all(
				(tags as string).split(',').map(async (tag: string) => {
					const tagExist = await Tag.findOne({ slug: tag });
					return tagExist?._id;
				})
			);
			query.tags = { $in: tagsIds };
		} else {
			delete query.tags;
		}
		if (search) {
			query.search = { $regex: search, $options: 'i' };
		} else {
			delete query.search;
		}
		const totalBooks = await Book.countDocuments(query);
		// if no books
		if (totalBooks === 0) {
			return next(AppError.notFound('No books found'));
		}
		// find all the books
		const books = await Book.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit);
		const totalPages = Math.ceil(totalBooks / limit);
		if (page > totalPages) {
			return next(AppError.notFound('Page out of range'));
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
		let slug = slugify.default(title, { lower: true, trim: true });
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

// update the book
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
			return next(AppError.notFound('Book does not exist'));
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

// delete the book by id
export const deleteBook = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const _id = req.params.id;
		// check if the book exists
		const bookExists = await Book.findById(_id);
		if (!bookExists) {
			return next(AppError.notFound('Book does not exist'));
		}
		await Book.deleteOne({ _id });
		return res.status(200).json({
			status: 'success',
			message: 'Book deleted successfully',
		});
	}
);
