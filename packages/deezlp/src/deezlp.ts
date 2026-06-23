import { DeezerCore, TRACK_FORMATS } from 'deezer';
import type { Listener, Settings } from './interfaces';
import { DEFAULT_SETTINGS } from './constants';
import { NotLoggedInException } from './exceptions';
import { resolveDeezerUrl } from './resolvers';
import { createDownloadJob, type DownloadJob } from './entities/DownloadJob';
import { getStrategy } from './strategies';
import type { DownloadPayload } from './entities';

/**
 * Deezlp is the main class that manages the Deezer API interactions and provides methods to access and manipulate data related to tracks, albums, artists, playlists.
 *
 * @author aluissp
 * @version 1.0.0
 * */
export class Deezlp {
	private dz: DeezerCore;
	settings: Settings;
	bitrate: number;
	playlistCovername?: string;
	playlistURLs: { url: string; ext: string }[];
	coverQueue: Record<string, string>;
	listener: Listener;

	constructor(settings?: Settings) {
		this.dz = new DeezerCore();

		this.settings = settings ?? DEFAULT_SETTINGS;
		this.bitrate = this.settings.maxBitrate ?? TRACK_FORMATS.MP3_128;
		this.playlistURLs = [];
		this.coverQueue = {};
		this.listener = { send: () => {} };
	}

	/**
	 * Logs in to Deezer using the provided ARL cookie
	 *
	 * @param arl The deezer arl from cookies
	 * @returns {boolean} Whether the login was successful or not
	 */
	loginViaArl(arl: string) {
		return this.dz.loginViaArl(arl);
	}

	/**
	 * Sets the listener for download events
	 * @param listener The listener function
	 */
	setListener(listener: Listener) {
		this.listener = listener;
	}

	/**
	 * Start download urls
	 */
	async download(urls: string | string[]) {
		if (typeof urls === 'string') urls = [urls];

		if (!this.dz.loggedIn) throw new NotLoggedInException('You must be logged in to download tracks! Use arl or username/password to log in.');

		for (const url of urls) {
			const job = createDownloadJob<DownloadPayload>(url);
			this.listener.send('download:start', { job });

			try {
				// 1. Resolve the URL
				this.updateJob(job, 'resolving');
				const resolvedUrl = resolveDeezerUrl(url);

				// 2. Get strategy
				const strategy = getStrategy(resolvedUrl.type);

				// 3. Execute strategy
				this.updateJob(job, 'fetching');
				const items = await strategy.process(resolvedUrl, this.dz, { bitrate: this.bitrate });

				this.updateJob(job, 'downloading');
				job.payload = items;

				// 4. Start download with worker
				// await this.downloaderWorker.start(job.payload, progressValue => {
				// 	job.progress = progressValue;

				// 	this.listener.send('download:progress', { job });
				// });
			} catch (error) {
				job.error = error;
				this.updateJob(job, 'error');
				this.listener.send('download:error', { job, error });
			}
		}
	}

	private updateJob(job: DownloadJob, status: DownloadJob['status']) {
		job.status = status;
		job.updatedAt = Date.now();
	}
}
