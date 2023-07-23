import Express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

// import routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import bookRoutes from './routes/book.js';
import tagRoutes from './routes/tag.js';
import articleRoutes from './routes/article.js';

// import db connection
import connectDB from './utils/connectDB.js';
import notFound from './controllers/notFound.js';
import globalError from './controllers/globalError.js';

// config .env
dotenv.config();

// init express app
const app = Express();

// connect to db
connectDB();

// middlewares
app.use(Express.json());
app.use(morgan('dev'));
app.use(
	cors({
		origin: process.env.CLIENT_URL,
	})
);

// app routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/articles', articleRoutes);

// 404 route
app.use('*', notFound);

// global error handler
app.use(globalError);

app.listen(process.env.PORT, (): void => {
	console.log(
		`Server is running on port http://localhost:${process.env.PORT} 🚀`
	);
});
