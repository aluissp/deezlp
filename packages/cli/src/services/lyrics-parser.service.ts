import { join } from 'path';
import type { Deezlp } from 'deezlp';
import type { LoggerService } from './logger.service';
import { readdirSync, readFileSync, statSync } from 'fs';

export class LyricsParserService {
	constructor(
		private readonly dl: Deezlp,
		private readonly logger: LoggerService,
	) {}

	async execute(filePaths: string[]) {
		// 1. Set save sync lyrics to true
		this.dl.setSettings({ syncedLyrics: true });

		// 2. Validate if file paths are file or directory
		const jsonSyncLyrics = this.valideFilePaths(filePaths);

		// 3. Parse Sync JSON Lyrics
		const parsedLyricsPromises = jsonSyncLyrics
			.map(lrcPath => readFileSync(lrcPath, 'utf-8').toString())
			.map(this.dl.parseJsonSyncLyrics.bind(this.dl));

		const parsedLyrics = await Promise.all(parsedLyricsPromises);

		// 4. Display parsed lyrics
		parsedLyrics.forEach((lyrics, index) => {
			this.logger.info(`Parsed lyrics for JSON ${index + 1} and saved to: ${lyrics.savedPath}`);
		});
	}

	private valideFilePaths(filePaths: string[]): string[] {
		return filePaths
			.map(dirPath => {
				try {
					const stat = statSync(dirPath);

					if (stat.isFile()) return dirPath;
					if (!stat.isDirectory()) return '';

					return readdirSync(dirPath, { withFileTypes: true })
						.filter(dirent => dirent.isFile())
						.map(dirent => dirent.name)
						.map(filePath => join(dirPath, filePath));
				} catch (error) {
					return '';
				}
			})
			.flat()
			.filter(filePath => !!filePath)
			.filter(filePath => filePath.includes('.json'));
	}
}
