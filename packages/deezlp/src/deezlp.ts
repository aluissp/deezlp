import { DeezerCore, TRACK_FORMATS } from 'deezer';
import type { Settings } from './interfaces';
import { DEFAULT_SETTINGS } from './constants';
import { generateDownloadableObjects, Single, type DownloadableObject } from './factory';
import { NotLoggedInException } from './exceptions';

/**
 * Deezlp is the main class that manages the Deezer API interactions and provides methods to access and manipulate data related to tracks, albums, artists, playlists.
 *
 * @author aluissp
 * @version 1.0.0
 * */
export class Deezlp {
	private dz: DeezerCore;
	private downloadObject: DownloadableObject[];
	settings: Settings;
	bitrate: number;
	playlistCovername?: string;
	playlistURLs: { url: string; ext: string }[];
	coverQueue: Record<string, string>;
	// listener: () => void;

	constructor(settings?: Settings) {
		this.dz = new DeezerCore();
		this.downloadObject = [];

		this.settings = settings ?? DEFAULT_SETTINGS;
		this.bitrate = this.settings.maxBitrate ?? TRACK_FORMATS.MP3_128;
		this.playlistURLs = [];
		this.coverQueue = {};
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
	 * Start download urls
	 */
	async download(urls: string | string[]) {
		if (typeof urls === 'string') urls = [urls];

		if (!this.dz.loggedIn) throw new NotLoggedInException('You must be logged in to download tracks! Use arl or username/password to log in.');

		await this.generateDownloadObject(urls);

		// Start downloads
		await Promise.all(this.downloadObject.map(downloadObject => this.start(downloadObject)));
	}

	private async generateDownloadObject(urls: string[]) {
		const downloadObjectsPromises = urls.map(url => generateDownloadableObjects(this.dz, url, this.bitrate));

		const downloadObjects = await Promise.all(downloadObjectsPromises);

		this.downloadObject.push(...downloadObjects.flat());
	}

	private async start(downloadObject: DownloadableObject) {
		if (downloadObject instanceof Single) {
			const track = await this.downloadTrack(downloadObject);
		}
	}

	private async downloadTrack(track: Single) {

	}
}
