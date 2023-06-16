export default class AppError extends Error {
	statusCode: Number;

	constructor(message: string, statusCode: Number) {
		super(message);
		this.statusCode = statusCode;
	}

	static badRequest(message: string) {
		return new AppError(message, 400);
	}

	static unauthorized(message: string) {
		return new AppError(message, 401);
	}

	static forbidden(message: string) {
		return new AppError(message, 403);
	}

	static notFound(message: string) {
		return new AppError(message, 404);
	}

	static internal(message: string) {
		return new AppError(message, 500);
	}

	static badGateway(message: string) {
		return new AppError(message, 502);
	}

	static serviceUnavailable(message: string) {
		return new AppError(message, 503);
	}
}
