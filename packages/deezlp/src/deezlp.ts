import { DeezerCore, TRACK_FORMATS } from 'deezer';
import type { Listener, Settings } from './interfaces';
import { DEFAULT_SETTINGS } from './constants';
import { NotLoggedInException } from './exceptions';
import { resolveDeezerUrl } from './resolvers';
import { createDownloadJob, type DownloadJob } from './entities/DownloadJob';
import { getStrategy } from './strategies';
import type { DownloadPayload } from './entities';
import { DownloadWorker } from './workers';
import { DownloadPipeline } from './pipelines';

/**
 * Deezlp is the main class that manages the Deezer API interactions and provides methods to access and manipulate data related to tracks, albums, artists, playlists.
 *
 * @author aluissp
 * @version 1.0.0
 * */
export class Deezlp {
	private dz: DeezerCore;
	settings: Settings;
	playlistCovername?: string;
	playlistURLs: { url: string; ext: string }[];
	coverQueue: Record<string, string>;
	listener: Listener;

	constructor(settings?: Settings) {
		this.dz = new DeezerCore();

		this.settings = settings ?? DEFAULT_SETTINGS;
		this.settings.maxBitrate = this.settings?.maxBitrate ?? TRACK_FORMATS.MP3_128;
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

		const pipeline = new DownloadPipeline(this.dz, this.settings, this.listener);
		await pipeline.start(urls);
	}
}
