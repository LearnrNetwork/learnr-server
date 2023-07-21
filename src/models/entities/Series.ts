import mongoose from 'mongoose';

export interface ISeries extends mongoose.Document {
	title: string;
	author: string | mongoose.Types.ObjectId;
	description: string;
	slug: string;
	publishedDate: Date;
	publisher: string;
	tags: mongoose.Types.ObjectId[];
	averageRating: number;
	ratingsCount: number;
	hiddenTag?: mongoose.Types.ObjectId[];
}

const SeriesSchema = new mongoose.Schema<ISeries>(
	{
		title: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
			validate: {
				validator: (value: any) => {
					if (typeof value === 'string') {
						return true;
					}
					return mongoose.Types.ObjectId.isValid(value);
				},
				message: 'Author must be a string or id',
			},
		},
		description: {
			type: String,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		publishedDate: {
			type: Date,
			required: true,
		},
		publisher: {
			type: String,
		},
		tags: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Tag',
		},
		hiddenTag: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Tag',
		},
	},
	{ timestamps: true }
);

const Book = mongoose.model<ISeries>('Series', SeriesSchema);

export default Book;
