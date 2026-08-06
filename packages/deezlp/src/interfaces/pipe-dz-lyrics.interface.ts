export interface PipeDzLyrics {
	data: Data;
	extensions: Extensions;
}

interface Data {
	track: Track;
}

interface Track {
	id: string;
	lyrics: Lyrics;
	__typename: string;
}

interface Lyrics {
	id: string;
	text: string;
	synchronizedWordByWordLines?: SynchronizedWordByWordLine[];
	__typename: string;
	synchronizedLines?: SynchronizedLine[];
	licence: string;
	copyright: string;
	writers: string;
}

interface SynchronizedLine {
	lrcTimestamp: string;
	line: string;
	lineTranslated: null;
	milliseconds: number;
	duration: number;
	__typename: string;
}

interface SynchronizedWordByWordLine {
	start: number;
	end: number;
	words?: SynchronizedWordByWordLine[];
	__typename: string;
	word?: string;
}

interface Extensions {
	queryCost: number;
}
