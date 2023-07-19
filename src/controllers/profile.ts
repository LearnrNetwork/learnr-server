import { NextFunction, Response, Request } from 'express';
import catchAsync from '../utils/catchAsync.js';
import Profile from '../models/entities/Profile.js';
import AppError from '../utils/AppError.js';

// add user in the Request Object
declare global {
	namespace Express {
		interface Request {
			user: any;
		}
	}
}

export const createProfile = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		// get the user
		const user = req.user;
		const { pronoun, birthday, education, country, bio, social } = req.body;
		// check if user has a profile
		const profileExists = await Profile.findOne({ user: user._id });
		if (profileExists) {
			return next(AppError.badRequest('Profile already exists'));
		}
		// create profile
		const profile = await Profile.create({
			user: user._id,
			pronoun,
			birthday,
			education,
			country,
			bio,
			social,
		});
		// send response
		res.status(201).json({
			status: 'success',
			profile,
		});
	}
);

// update profile
export const updateProfile = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		// get the user
		const user = req.user;
		const { pronoun, birthday, education, country, bio, social } = req.body;
		// get the profile
		const profile = await Profile.findOne({ user: user._id });
		// check if profile exists
		if (!profile) {
			return next(AppError.notFound('Profile not found'));
		}
		// update profile
		const updatedProfile = await Profile.findByIdAndUpdate(
			profile._id,
			{ pronoun, birthday, education, country, bio, social },
			{ new: true, runValidators: true }
		);
		// send response
		res.status(200).json({
			status: 'success',
			profile: updatedProfile,
		});
	}
);

export const getProfile = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		// get the user
		const _id = req.params.user;
		// get the profile
		const profile = await Profile.findOne({ user: _id });
		// check if profile exists
		if (!profile) {
			return next(AppError.notFound('Profile not found'));
		}
		// send response
		res.status(200).json({
			status: 'success',
			profile,
		});
	}
);
