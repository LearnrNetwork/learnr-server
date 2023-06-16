export default function globalError(err: any, req: any, res: any, next: any) {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'fail';
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
}
