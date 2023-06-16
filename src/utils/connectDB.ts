import mongoose from 'mongoose';

export default async function connectDB() {
	try {
		const conn = await mongoose.connect(process.env.DB_URL || '');
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error: any) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
}
