import mongoose from 'mongoose';

export interface ITag extends mongoose.Document {
	name: string;
	slug: string;
	description: string;
}

const TagSchema = new mongoose.Schema<ITag>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;
