import mongoose from 'mongoose';

// pronoun enum
enum Pronoun {
	heHim = 'he/him',
	sheHer = 'she/her',
	theyThem = 'they/them',
}

// Profile interface
export interface IProfile extends mongoose.Document {
	pronoun?: Pronoun;
	education?: {
		from: Date;
		to: Date;
	};
	birthday?: Date;
	country?: string;
	bio?: string;
	social?: {
		facebook?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
	};
	user: mongoose.Schema.Types.ObjectId;
}

const profileSchema = new mongoose.Schema<IProfile>(
	{
		pronoun: {
			type: String,
			enum: {
				values: Object.values(Pronoun),
				message: 'Pronoun is either: he/him, she/her, they/them',
			},
		},
		birthday: {
			type: Date,
		},
		education: {
			from: {
				type: Date,
			},
			to: {
				type: Date,
			},
		},
		country: {
			type: String,
		},
		bio: {
			type: String,
			maxlength: 500,
		},
		social: {
			facebook: {
				type: String,
			},
			twitter: {
				type: String,
			},
			instagram: {
				type: String,
			},
			linkedin: {
				type: String,
			},
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
