import { join } from 'path';
import { parseLyrics } from '@/utils';
import { DeezerCore, type GWLyrics } from 'deezer';
import type { FileService } from './file.service';
import type { PipeDzLyrics, Settings } from '@/interfaces';

export class LyricsParserService {
	constructor(
		private deezer: DeezerCore,
		private settings: Settings,
		private fileService: FileService,
	) {}

	/**
	 * Parse the JSON string of synchronized lyrics from Pipe Deezer api
	 * @param syncLrcJson
	 * @returns A saved path of the lyrics file
	 */
	async parseJsonSyncLyrics(syncLrcJson: string): Promise<{ savedPath: string }> {
		// 1. Parse the JSON string to get the PipeDzLyrics object
		const { data } = JSON.parse(syncLrcJson) as PipeDzLyrics;

		const synchronizedLines = data.track.lyrics.synchronizedLines ?? [];

		const lyrics: GWLyrics = {
			LYRICS_ID: data.track.lyrics.id,
			LYRICS_COPYRIGHTS: data.track.lyrics.copyright,
			LYRICS_WRITERS: data.track.lyrics.writers,
			LYRICS_TEXT: data.track.lyrics.text,
			LYRICS_SYNC_JSON: synchronizedLines.map(line => ({
				line: line.line,
				lrc_timestamp: line.lrcTimestamp,
				milliseconds: line.milliseconds.toString(),
				duration: line.duration.toString(),
			})),
		};

		// 2. Parse the GWLyrics object to get the Lyrics object
		const parsedLyrics = parseLyrics(lyrics);

		// 3. Fetch track data from Deezer API
		const track = await this.deezer.api.getTrack(data.track.id).catch(() => undefined);

		let fileName = data.track.id;
		let filePath = join(this.settings.downloadLocation, 'lyrics');

		// 4. Build the final path for the track
		if (track) {
			const { fileName: trackFileName, filePath: trackFilePath } = this.fileService.buildTrackPath(track);
			fileName = trackFileName;
			filePath = trackFilePath;
		}

		// 5. Save the synced lyrics if they exist
		this.fileService.saveSyncedLyrics(filePath, fileName, parsedLyrics?.sync);

		return { savedPath: join(filePath, fileName + '.lrc') };
	}
}
