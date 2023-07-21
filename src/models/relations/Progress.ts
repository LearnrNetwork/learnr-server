import mongoose from 'mongoose';
import { IArticle } from '../entities/Article.js';
import { IUser } from '../entities/User.js';
import { ISeries } from '../entities/Series.js';
import { IBook } from '../entities/Book.js';

export interface IProgress extends Document {
	user: IUser;
	on: ISeries | IBook;
	progress: IArticle;
}

const ProgressSchema = new mongoose.Schema<IProgress>({
	user: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	on: {
		type: mongoose.Types.ObjectId,
		refPath: 'onModel',
		onModel: {
			type: String,
			enum: ['series', 'book'],
		},
	},
	progress: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Article',
		},
	],
});

const Progress = mongoose.model<IProgress>('Progress', ProgressSchema);

export default Progress;
