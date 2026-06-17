import z from 'zod';
import { artistSchema, contributorSchema } from './artist-schema';

/**
 * This is the deezer track schema, based on the API response from Deezer.
 * Here's the documentation for the track object: https://developers.deezer.com/api/explorer?url=track/3135556
 */
export const deezerTrackSchema = z.object({
	id: z.number(),
	readable: z.boolean(),
	title: z.string(),
	title_short: z.string(),
	title_version: z.string().optional(),
	isrc: z.string(),
	link: z.string(),
	share: z.string(),
	duration: z.number(),
	track_position: z.number(),
	disk_number: z.number(),
	rank: z.number(),
	release_date: z.string(),
	explicit_lyrics: z.boolean(),
	explicit_content_lyrics: z.number(),
	explicit_content_cover: z.number(),
	preview: z.string(),
	bpm: z.number(),
	gain: z.number(),
	md5_image: z.string(),
	type: z.literal('track'),
	size: z.number().optional(),
	lyrics_id: z.number().optional(),
	lyrics: z.string().optional(),
	position: z.number().optional(),
	copyright: z.string().optional(),
	physical_release_date: z.string().optional(),
	digital_release_date: z.string().optional(),
	genres: z.array(z.string()).optional(),
	md5_origin: z.number().optional(),
	available_countries: z.array(z.string()),
	artist: artistSchema,
	contributors: z.array(contributorSchema),
	album: z.object({
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
	}),
	filesizes: z.record(z.string(), z.any()).optional(),
	track_token: z.string().optional(),
	media_version: z.string().optional(),
	track_token_expire: z.number().optional(),
	user_id: z.number().optional(),
	token: z.string().optional(),
	song_contributors: z
		.object({
			main_artist: z.array(z.string()),
			author: z.array(z.string()),
		})
		.optional(),
});

export type DeezerTrack = z.infer<typeof deezerTrackSchema>;
