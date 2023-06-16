import Express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

// import routes
import authRoutes from './routes/auth.js';

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

// app routes
app.use('/api/v1/auth', authRoutes);

// 404 route
app.use('*', notFound);

// global error handler
app.use(globalError);

app.listen(process.env.PORT, (): void => {
	console.log(
		`Server is running on port http://localhost:${process.env.PORT} 🚀`
	);
});
