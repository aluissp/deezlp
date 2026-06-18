import z from "zod";

export const albumSchema = z.object({
	id: z.number(),
	title: z.string(),
	link: z.string(),
	cover: z.string(),
	cover_small: z.string(),
	cover_medium: z.string(),
	cover_big: z.string(),
	cover_xl: z.string(),
	md5_image: z.string(),
	release_date: z.string().nullable(),
	tracklist: z.string(),
	type: z.literal('album'),
});


export type DeezerAlbum = z.infer<typeof albumSchema>;
