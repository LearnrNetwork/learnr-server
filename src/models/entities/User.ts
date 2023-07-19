import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// User interface
export interface IUser extends Document {
	firstname: string;
	lastname: string | undefined;
	email: string;
	username: string;
	password: string | undefined;
	hashPassword(password: string): Promise<string>;
	comparePassword(
		candidatePassword: string,
		hashedPassword: string
	): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
	{
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		password: {
			type: String,
			required: true,
			maxlength: 30,
			select: false,
		},
	},
	{ timestamps: true }
);

// hash password
userSchema.methods.hashPassword = async function (password: string) {
	const salt = await bcrypt.genSalt(12);
	return await bcrypt.hash(password, salt);
};

// compare password with hashed password
userSchema.methods.comparePassword = async function (
	candidatePassword: string,
	hashedPassword: string
) {
	return await bcrypt.compare(candidatePassword, hashedPassword);
};

// hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	if (this.password) {
		this.password = await this.hashPassword(this.password);
	}
	next();
});

const User = mongoose.model('User', userSchema);

export default User;
