import mongoose from 'mongoose';

interface IRating extends mongoose.Document {
	book: mongoose.Types.ObjectId;
	user: mongoose.Types.ObjectId;
	rating: number;
	content: string;
}

const RatingSchema = new mongoose.Schema<IRating>(
	{
		book: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Book',
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		rating: {
			type: Number,
			min: 0,
			max: 5,
			required: true,
		},
		content: {
			type: String,
			maxlength: 500,
		},
	},
	{ timestamps: true }
);

const Rating = mongoose.model('Rating', RatingSchema);

export default Rating;
