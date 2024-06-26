import { nanoid } from 'nanoid';
import slugify from 'slugify';

interface options {
	replacement?: string;
	remove?: RegExp;
	lower?: boolean;
	strict?: boolean;
	locale?: string;
	trim?: boolean;
}

export default function uniqueSlug(
	title: string,
	options: options = {
		trim: true,
		lower: true,
		strict: true,
		remove: /[*+~.()'"!:@]/g,
	}
) {
	return slugify.default(title, options) + '-' + nanoid(6);
}
