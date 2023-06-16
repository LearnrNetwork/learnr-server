import User from '../models/User.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

interface IJwtPayload extends JwtPayload {
	_id: string;
}

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
		user.password = undefined;

		// create token
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || '');

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
			{ _id: userExists._id },
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

export const isLoggedin = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		// get the token
		const token = req.headers.authorization?.split(' ')[1];

		// check if token exists
		if (!token) {
			return next(AppError.badRequest('Please login'));
		}

		// verify token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || ''
		) as IJwtPayload;
		// check if user exists
		const user = await User.findById(decoded._id);
		if (!user) {
			return next(AppError.badRequest('User does not exist'));
		}

		// remove password from response
		user.password = undefined;
		// send the user in the request
		req.user = user;
		next();
	}
);

// check if the user can edit the profile or blog or anything
export const isAuthorized = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		// get the user
		const user = req.user;

		// check if the user is the owner of the profile
		if (user._id.toString() !== req.params.user) {
			return next(AppError.badRequest('You are not authorized'));
		}

		next();
	}
);
