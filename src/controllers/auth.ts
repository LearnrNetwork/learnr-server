import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const signup = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { firstname, lastname, email, username, password } = req.body;
		// check if user exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return next(AppError.badRequest('User already exists'));
		}

		// check if username is available
		const usernameTaken = await User.findOne({ username });
		if (usernameTaken) {
			return next(AppError.badRequest('Username already taken'));
		}

		// create user
		const user = await User.create({
			firstname,
			lastname,
			email,
			username,
			password,
		});

		// remove password from response

		// create token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '');

		// send response
		res.status(201).json({
			status: 'success',
			user,
			token,
		});
	}
);

export const signin = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		// get the username or email, and password
		const { identity, password } = req.body;

		// check if user exists with the username or email
		const userExists = await User.findOne({
			$or: [{ username: identity }, { email: identity }],
		}).select('+password');
		if (!userExists) {
			return next(AppError.badRequest('User does not exist'));
		}

		// check if password is correct
		const isPasswordCorrect = await userExists.comparePassword(
			password ?? '',
			userExists.password ?? ''
		);

		if (!isPasswordCorrect) {
			return next(AppError.badRequest('Invalid username/email or password'));
		}

		// create token
		const token = jwt.sign(
			{ id: userExists._id },
			process.env.JWT_SECRET || ''
		);

		// remove password from response
		userExists.password = undefined;

		// send response
		res.status(200).json({
			status: 'success',
			user: userExists,
			token,
		});
	}
);
