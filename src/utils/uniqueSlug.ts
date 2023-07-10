import { nanoid } from 'nanoid';
import slugify from 'slugify';

export default function uniqueSlug(title: string, options?: any) {
	return slugify.default(title, options) + nanoid(5);
}
