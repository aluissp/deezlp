// Explicit Content Lyrics
export const LyricsStatus = {
	NOT_EXPLICIT: 0, // Not Explicit
	EXPLICIT: 1, // Explicit
	UNKNOWN: 2, // Unknown
	EDITED: 3, // Edited
	PARTIALLY_EXPLICIT: 4, // Partially Explicit (Album "lyrics" only)
	PARTIALLY_UNKNOWN: 5, // Partially Unknown (Album "lyrics" only)
	NO_ADVICE: 6, // No Advice Available
	PARTIALLY_NO_ADVICE: 7, // Partially No Advice Available (Album "lyrics" only)
} as const;
