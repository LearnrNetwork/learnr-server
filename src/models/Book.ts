import mongoose from 'mongoose';

interface IBook extends mongoose.Document {
	title: string;
	author: string | mongoose.Types.ObjectId;
	description: string;
	slug: string;
	publishedDate: Date;
	publisher: string;
	tags: mongoose.Types.ObjectId[];
	averageRating: number;
	ratingsCount: number;
	bookCover: string;
	amazonLink: string;
}

const BookSchema = new mongoose.Schema<IBook>(
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
		averageRating: {
			type: Number,
			min: 0,
			max: 5,
		},
		ratingsCount: {
			type: Number,
			min: 0,
		},
		bookCover: {
			type: String,
			required: true,
		},
		amazonLink: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Book = mongoose.model('Book', BookSchema);

export default Book;
