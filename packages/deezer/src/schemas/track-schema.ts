import z from 'zod';
import { artistSchema, contributorSchema } from './artist-schema';
import { albumSchema } from './album-schema';

/**
 * This is the deezer track schema, based on the API response from Deezer.
 * Here's the documentation for the track object: https://developers.deezer.com/api/explorer?optional=track/3135556
 */
export const deezerTrackSchema = z.object({
	id: z.number(),
	readable: z.boolean(),
	title: z.string(),
	title_short: z.string().optional(),
	title_version: z.string().optional(),
	isrc: z.string(),
	link: z.string().optional(),
	share: z.string().optional(),
	duration: z.number(),
	/** The position (track number) of the track within its album */
	track_position: z.number(),
	disk_number: z.number(),
	rank: z.number(),
	release_date: z.string(),
	explicit_lyrics: z.boolean(),
	explicit_content_lyrics: z.number(),
	explicit_content_cover: z.number(),
	preview: z.string().optional(),
	bpm: z.number().nullable(),
	gain: z.number(),
	available_countries: z.array(z.string()),
	md5_image: z.string(),
	track_token: z.string(),
	type: z.literal('track'),
	album: albumSchema,
	artist: artistSchema,
	contributors: z.array(contributorSchema),
});

export type DeezerTrack = z.infer<typeof deezerTrackSchema>;
