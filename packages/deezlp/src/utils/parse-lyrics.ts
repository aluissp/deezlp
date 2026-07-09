import type { Lyrics } from '@/interfaces';
import type { GWLyrics } from 'deezer';

/**
 * Parse the lyrics from the GWLyrics object to the Lyrics object.
 * @param gwLyrics The GWLyrics object to parse.
 * @returns
 */
export const parseLyrics = (gwLyrics: GWLyrics): Lyrics | undefined => {
	if (Object.keys(gwLyrics).length === 0) return;

	const id = gwLyrics.LYRICS_ID ? +gwLyrics.LYRICS_ID : 0;
	const unsync = gwLyrics.LYRICS_TEXT ?? '';
	const copyright = gwLyrics.LYRICS_COPYRIGHTS ?? '';
	const writers = gwLyrics.LYRICS_WRITERS ?? '';
	const syncLyricsJson = gwLyrics.LYRICS_SYNC_JSON ?? [];

	const sync = syncLyricsJson
		.map((line, index, array) => {
			const currentLine = line.line;
			const timestamp = line.lrc_timestamp ?? '';
			const milliseconds = parseInt(line.milliseconds ?? '0');

			if (currentLine !== '') return `${timestamp}${currentLine}\r\n`;

			// Find next non-empty line to get the timestamp
			let notEmptyLine = index + 1;

			while (notEmptyLine < array.length && array[notEmptyLine]?.line === '') notEmptyLine += 1;

			const nextTimestamp = array[notEmptyLine]?.lrc_timestamp ?? '';

			return `${nextTimestamp}${currentLine}\r\n`;
		})
		.join('');

	const syncID3 = syncLyricsJson
		.map(line => {
			const currentLine = line.line;
			const milliseconds = parseInt(line.milliseconds ?? '0');

			if (currentLine === '') return;

			return [currentLine, milliseconds] as const;
		})
		.filter(line => !!line);

	return {
		id,
		sync,
		unsync,
		syncID3,
		writers,
		copyright,
	};
};
