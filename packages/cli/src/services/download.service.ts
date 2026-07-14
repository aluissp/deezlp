import { Deezlp } from 'deezlp';
import { resolve } from 'path';
import { TRACK_FORMATS } from 'deezer';
import type { LoggerService } from './logger.service';
import type { LoginService } from './login.service';
import type { FileService } from './file.service';

export class DownloadService {
	private readonly bitrateTextNumberMap = {
		[TRACK_FORMATS.MP3_128]: ['mp3_128', '128', '1'],
		[TRACK_FORMATS.MP3_320]: ['mp3_320', '320', '3'],
		[TRACK_FORMATS.FLAC]: ['flac', 'lossless', '9'],
	} as const;

	constructor(
		private readonly dl: Deezlp,
		private readonly logger: LoggerService,
		private readonly fileService: FileService,
		private readonly loginService: LoginService,
	) {}

	async executeDownload(urls: string[], { bitrate, path, portable }: { path?: string; bitrate?: string; portable?: boolean }): Promise<void> {
		// 1. Check if the user is logged in
		if (!this.dl.loggedIn) await this.loginService.loginViaArl();

		// 2. Is portable?
		this.fileService.loadConfigPath(!!portable);

		// 3. Load settings
		const settings = this.fileService.loadSettings();

		// 4. Override the settings
		if (path) settings.downloadLocation = resolve(path);
		if (bitrate) settings.maxBitrate = this.parseBitrate(bitrate);

		this.dl.setSettings(settings);

		// 5. Download the tracks
		this.logger.info(`Starting download for ${urls.length} url(s)...`);
		const session = this.dl.prepare(urls);

		// 6. Listen to the download progress
		session.on('job:status', job => {
			// track log
			if (job.payload?.type === 'track') {
				if (job.status === 'downloading')
					this.logger.info(`Downloading ${job.payload?.title} by ${job.payload?.artist?.name}: (${job?.progress?.toFixed(2)}%)`);
				else if (job.status === 'tagging') this.logger.success(`Tagging track: ${job.payload?.title} by ${job.payload?.artist?.name}`);

				// album log
			} else if (job.payload?.type === 'album') {
				const album = job.payload?.enrichedTracks?.[0]?.album;
				const artist = job.payload?.enrichedTracks?.[0]?.artist;
				const currentTrackIndex = job.payload?.currentProgress?.trackIndex;
				const total = job.payload?.enrichedTracks?.length;
				if (job.status === 'downloading' && album && artist && currentTrackIndex && total) {
					const track = job.payload?.enrichedTracks?.[currentTrackIndex];
					this.logger.info(
						`Downloading album ${album?.title} by ${artist?.name} [${currentTrackIndex + 1}/${total}]: ${track?.title} (${job?.progress?.toFixed(2)}%)`,
					);
				}
			}
		});

		// 7. Await the download to finish
		await session.start();

		this.logger.success(`Download completed for ${urls.length} url(s)!`);
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
