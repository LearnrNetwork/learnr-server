import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export default function isValid(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			status: 'fail',
			message: 'Validation failed',
			errors: errors.array().map((err) => err.msg),
		});
	}
	next();
}
