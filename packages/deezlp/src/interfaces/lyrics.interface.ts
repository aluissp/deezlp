/** Represents a parsed lyrics */
export interface Lyrics {
	id: number;
	unsync: string;
	syncLyrics?: string;
	copyright: string;
	writers: string;
}
