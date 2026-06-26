/** No 360 track formats */
export const FORMATS_NO_360 = {
	/** FLAC format, lossless quality */
	FLAC: 9,
	/** 320 kbps, high quality */
	MP3_320: 3,
	/** 128 kbps, standard quality */
	MP3_128: 1,
} as const;

/** Sony 360 Reality Audio formats */
export const FORMATS_360 = {
	/** 360 Reality Audio format, ultra high quality */
	MP4_RA3: 15,
	/** 360 Reality Audio format, high quality */
	MP4_RA2: 14,
	/** 360 Reality Audio format, standard quality */
	MP4_RA1: 13,
} as const;

/** Here's all formats, also includes MP3_MISC format (8, 0), Mapped from string to number */
export const TRACK_FORMATS = {
	...FORMATS_NO_360,
	...FORMATS_360,
	/** Refers a MP3_MISC format */
	DEFAULT: 8,
	/** Refers a MP3_MISC format */
	LOCAL: 0,
} as const;

/** Names for each track format mapped from number to string */
export const TRACK_FORMAT_NAMES = {
	[TRACK_FORMATS.FLAC]: 'FLAC',
	[TRACK_FORMATS.MP3_320]: 'MP3_320',
	[TRACK_FORMATS.MP3_128]: 'MP3_128',
	[TRACK_FORMATS.MP4_RA3]: 'MP4_RA3',
	[TRACK_FORMATS.MP4_RA2]: 'MP4_RA2',
	[TRACK_FORMATS.MP4_RA1]: 'MP4_RA1',
} as const;
