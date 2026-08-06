import { readFileSync } from 'fs';
import type { Deezlp } from 'deezlp';
import type { LoggerService } from './logger.service';

export class LyricsParserService {
	constructor(
		private readonly dl: Deezlp,
		private readonly logger: LoggerService,
	) {}

	async execute(jsonSyncLyrics: string[]) {
		// 1. Set save sync lyrics to true
		this.dl.setSettings({ syncedLyrics: true });

		// 2. Parse Sync JSON Lyrics
		const parsedLyricsPromises = jsonSyncLyrics
			.map(lrcPath => readFileSync(lrcPath, 'utf-8').toString())
			.map(this.dl.parseJsonSyncLyrics.bind(this.dl));

		const parsedLyrics = await Promise.all(parsedLyricsPromises);

		// 3. Display parsed lyrics
		parsedLyrics.forEach((lyrics, index) => {
			this.logger.info(`Parsed lyrics for JSON ${index + 1} and saved to: ${lyrics.savedPath}`);
		});
	}
}
