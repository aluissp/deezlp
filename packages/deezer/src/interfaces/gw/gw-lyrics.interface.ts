export interface GWLyrics {
	LYRICS_ID?: string;
	LYRICS_SYNC_JSON?: LyricsSyncJSON[];
	LYRICS_TEXT?: string;
	LYRICS_COPYRIGHTS?: string;
	LYRICS_WRITERS?: string;
}

interface LyricsSyncJSON {
	lrc_timestamp?: string;
	milliseconds?: string;
	duration?: string;
	line: string;
}
