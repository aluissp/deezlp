import { resolve } from 'path';
import { TRACK_FORMATS } from 'deezer';
import type { Settings } from 'deezlp';
import type { FileService } from './file.service';
import type { LoggerService } from './logger.service';

export class ConfigService {
	private settings: Settings;

	private readonly bitrateTextNumberMap = {
		[TRACK_FORMATS.MP3_128]: ['mp3_128', '128', '1'],
		[TRACK_FORMATS.MP3_320]: ['mp3_320', '320', '3'],
		[TRACK_FORMATS.FLAC]: ['flac', 'lossless', '9'],
	} as const;

	constructor(
		private readonly fileService: FileService,
		private readonly logger: LoggerService,
	) {
		// Is portable?
		this.fileService.loadConfigPath(false);
		this.settings = this.fileService.loadSettings();
	}

	execute(options: { path?: string; bitrate?: string; show?: boolean; synclyrics?: string; tagsynclyrics?: string }) {
		const { bitrate, path, show, synclyrics, tagsynclyrics } = options;

		// 1. Show config
		const showConfig = (!path && !bitrate && !synclyrics && !tagsynclyrics && show === undefined) || show;

		if (showConfig) return this.showConfig();

		// 2. Override settings
		if (path) this.settings.downloadLocation = resolve(path);
		if (bitrate) this.settings.maxBitrate = this.parseBitrate(bitrate);
		if (synclyrics) this.settings.syncedLyrics = synclyrics === 'yes';
		if (tagsynclyrics) this.settings.tags.syncedLyrics = tagsynclyrics === 'yes';

		// 3. Save settings
		if (path || bitrate || synclyrics || tagsynclyrics) this.fileService.saveSettings(this.settings);
	}

	private showConfig() {
		this.logger.info('Current configuration:');
		this.logger.info(`- Download location: ${this.settings.downloadLocation}`);
		this.logger.info(`- Max bitrate: ${this.settings.maxBitrate}`);
		this.logger.info(`- Synced lyrics: ${this.settings.syncedLyrics}`);
		this.logger.info(`- Tagged synced lyrics: ${this.settings.tags.syncedLyrics}`);
	}

	private parseBitrate(bitrate: string) {
		bitrate = bitrate.trim().toLowerCase();

		for (const [format, aliases] of Object.entries(this.bitrateTextNumberMap)) {
			if ((aliases as readonly string[]).includes(bitrate)) {
				return Number(format);
			}
		}

		this.logger.warn(`Invalid bitrate "${bitrate}" provided.`);

		this.logger.info(
			`Available bitrates: ${Object.values(this.bitrateTextNumberMap)
				.map(aliases => aliases.join(', '))
				.join(' | ')}`,
		);

		// Shut down the process if the bitrate is invalid
		process.exit(1);
	}
}
