import { IUser } from '../entities/User.js';
import { ITag } from '../entities/Tag.js';
import { model, Schema } from 'mongoose';

export interface IFollow extends Document {
	follower: IUser;
	following: IUser | ITag;
}

const FollowSchema = new Schema<IFollow>(
	{
		follower: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		following: {
			type: Schema.Types.ObjectId,
			refPath: 'onModel',
			required: true,
			onModel: {
				type: String,
				enum: ['User', 'Tag'],
			},
		},
	},
	{ timestamps: true }
);

const Follow = model<IFollow>('Follow', FollowSchema);

export default Follow;
