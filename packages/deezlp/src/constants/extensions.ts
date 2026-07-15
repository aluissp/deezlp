import { TRACK_FORMATS } from 'deezer';

export const extensions = {
	[TRACK_FORMATS.FLAC]: '.flac',
	[TRACK_FORMATS.LOCAL]: '.mp3',
	[TRACK_FORMATS.MP3_320]: '.mp3',
	[TRACK_FORMATS.MP3_128]: '.mp3',
	[TRACK_FORMATS.DEFAULT]: '.mp3',
	[TRACK_FORMATS.MP4_RA3]: '.mp4',
	[TRACK_FORMATS.MP4_RA2]: '.mp4',
	[TRACK_FORMATS.MP4_RA1]: '.mp4',
} as const;

export type TrackExtensions = '.mp3' | '.flac';

// Re-exporting TRACK_FORMATS for external usage
export { TRACK_FORMATS };
