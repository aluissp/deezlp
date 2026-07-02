/** Represents a parsed lyrics */
export interface Lyrics {
	id: number;
	sync?: string;
	unsync: string;
	writers: string;
	copyright: string;
	syncID3?: (string | number)[][];
}
