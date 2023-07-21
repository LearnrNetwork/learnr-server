import mongoose, { model } from 'mongoose';

export interface IArticle extends Document {
	title: string;
	slug: string;
	content: string;
	reads: number;
	likes: number;
	tags: mongoose.Types.ObjectId[];
	parent: mongoose.Types.ObjectId;
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
		tags: [
			{
				type: [mongoose.Schema.Types.ObjectId],
				ref: 'Tag',
			},
		],
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'onModel',
			required: true,
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
			types: Number,
			default: 0,
			min: 0,
		},
	},
	{ timestamps: true }
);

const Article = model<IArticle>('Article', ArticleSchema);

export default Article;
