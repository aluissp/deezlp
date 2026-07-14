import { DeezerCore, TRACK_FORMATS } from 'deezer';
import type { DownloadSession, Settings } from './interfaces';
import { DEFAULT_SETTINGS } from './constants';
import { NotLoggedInException } from './exceptions';
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

	constructor(settings?: Settings) {
		this.dz = new DeezerCore();

		this.settings = settings ?? DEFAULT_SETTINGS;
		this.settings.maxBitrate = this.settings?.maxBitrate ?? TRACK_FORMATS.MP3_128;
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
	 * Indicates if the user is logged in
	 */
	get loggedIn() {
		return this.dz.loggedIn;
	}

	/**
	 * Sets the settings for the Deezlp instance
	 * @param settings The settings to set
	 * @returns {void}
	 */
	setSettings(settings: Partial<Settings>) {
		this.settings = { ...this.settings, ...settings };
	}

	/**
	 * Prepare download jobs
	 */
	prepare(urls: string | string[]) {
		if (!this.dz.loggedIn) throw new NotLoggedInException('You must be logged in to download tracks! Use arl or username/password to log in.');

		const pipeline = new DownloadPipeline(this.dz, this.settings);

		const jobs = pipeline.prepare(urls);

		const session: DownloadSession = {
			jobs,
			cancelAll: pipeline.cancelAll.bind(pipeline),
			cancelJob: pipeline.cancelJob.bind(pipeline),
			on(event, callback) {
				pipeline.on(event, callback);
				return this;
			},
			start: pipeline.start.bind(pipeline),
		};

		return session;
	}
}
