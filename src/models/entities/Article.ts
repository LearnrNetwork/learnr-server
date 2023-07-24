import mongoose, { model } from 'mongoose';

export interface IArticle extends Document {
	title: string;
	slug: string;
	content: string;
	author: mongoose.Types.ObjectId;
	contributors?: mongoose.Types.ObjectId[];
	reads?: number;
	likes?: number;
	tags: mongoose.Types.ObjectId[];
	parent?: mongoose.Types.ObjectId;
}

const ArticleSchema = new mongoose.Schema<IArticle>(
	{
		title: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		content: {
			type: String,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		contributors: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'onModel',
			onModel: {
				type: String,
				enum: ['Book', 'Series'],
			},
		},
		reads: {
			type: Number,
			default: 0,
			min: 0,
		},
		likes: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{ timestamps: true }
);

const Article = model<IArticle>('Article', ArticleSchema);

export default Article;
