import { Cookie, CookieJar } from 'tough-cookie';
import { DeezerGW } from './deezer-gw';
import type { GWUserData, TrackURLData, UserCore } from './interfaces';
import { DeezerApi } from './deezer-api';
import { DeezerMedia } from './deezer-media';
import { DeezerException, DeezerExceptionCodes } from './exceptions';
import { WrongGeolocation } from './exceptions/deezer-exception';

export class DeezerCore {
	/** The Deezer gateway instance */
	gw: DeezerGW;
	/** The Deezer api instance */
	api: DeezerApi;
	/** The Deezer media instance */
	private media: DeezerMedia;
	/** Indicates if the user is logged in */
	loggedIn: boolean;
	/** Refers to the list of child users */
	children: UserCore[];
	/** The cookie jar for managing cookies */
	cookieJar: CookieJar;
	/** The HTTP headers for requests */
	httpHeaders: { 'User-Agent': string; 'Accept-Language'?: string };
	/** The current logged-in user */
	currentUser: UserCore;
	/** The index of the currently selected user from the children list */
	selectedUserIndex: number;

	constructor() {
		this.httpHeaders = {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
		};
		this.children = [];
		this.loggedIn = false;
		this.cookieJar = new CookieJar();
		this.gw = new DeezerGW(this.cookieJar, this.httpHeaders);
		this.api = new DeezerApi(this.cookieJar, this.httpHeaders);
		this.media = new DeezerMedia(this.cookieJar, this.httpHeaders);
		this.currentUser = {};
		this.selectedUserIndex = 0;
	}

	// TODO: Implement login via email and password
	// async login() {}

	/**
	 * Logs in to Deezer using the provided ARL cookie
	 *
	 * @param arl The deezer arl from cookies
	 * @returns
	 */
	async loginViaArl(arl: string): Promise<boolean> {
		// Create cookie
		const cookieObj = new Cookie({
			key: 'arl',
			value: arl.trim(),
			domain: '.deezer.com',
			path: '/',
			httpOnly: true,
		});

		await this.cookieJar.setCookie(cookieObj.toString(), 'https://www.deezer.com');

		const userData = await this.gw.getUserData();

		// If userData is empty or not returned, set loggedIn to false
		if (!userData || (userData && Object.keys(userData).length === 0)) return (this.loggedIn = false);

		// If USER_ID is 0, it means the ARL cookie is invalid or expired, so set loggedIn to false
		if (userData.USER.USER_ID === 0) return (this.loggedIn = false);

		// Get children users
		await this.getChildren(userData);

		// Set the first user as the current user by default
		this.selectUserAccount(this.selectedUserIndex);

		return (this.loggedIn = true);
	}

	private async getChildren(userData: GWUserData) {
		this.children = [];

		const isFamily = userData?.USER?.MULTI_ACCOUNT?.ENABLED && !userData?.USER?.MULTI_ACCOUNT?.IS_SUB_ACCOUNT;

		if (isFamily) {
			// TODO: Implement getChildren method to fetch child users for family accounts
			return;
		}

		this.children.push({
			id: userData.USER.USER_ID,
			name: userData.USER.BLOG_NAME,
			picture: userData.USER.USER_PICTURE || '',
			license_token: userData.USER.OPTIONS.license_token,
			can_stream_hq: userData.USER.OPTIONS.web_hq || userData.USER.OPTIONS.mobile_hq,
			can_stream_lossless: userData.USER.OPTIONS.web_lossless || userData.USER.OPTIONS.mobile_lossless,
			country: userData.USER.OPTIONS.license_country,
			language: userData.USER.SETTING.global.language || '',
			loved_tracks: userData.USER.LOVEDTRACKS_ID,
		});
	}

	/**
	 * Selects a user account from the children list based on the provided index.
	 * If the index is out of bounds, it defaults to the first user.
	 * @param index the index of children users
	 * @returns An object containing the current user and the selected user index.
	 */
	public selectUserAccount(index: number) {
		// Fallback to the first user if the index is out of bounds
		if (index < 0 || index >= this.children.length) index = 0;

		this.currentUser = this.children[index] ?? {};
		this.selectedUserIndex = index;

		// example language: 'en-US;q=0.9,fr;q=0.8'
		const match = this.currentUser?.language?.match(/^[a-zA-Z]{2}(-[a-zA-Z]{2})?/);
		const lang = match?.[0] ?? 'us'; // By default 'us'

		// Set headers
		this.httpHeaders['Accept-Language'] = lang;

		return { currentUser: this.currentUser, selectedUserIndex: this.selectedUserIndex };
	}

	/**
	 * Fetches the track URL from Deezer using the provided track token and format.
	 *
	 * @param trackToken The track token for the desired track
	 * @param format The desired format for the track URL
	 * @returns A Promise that resolves to the TrackURLData or undefined if the user does not have a license token.
	 * @exceptions Throws a `WrongGeolocation` or `DeezerException` if result have errors
	 */
	public async getTrackUrl(trackToken: string, format: string): Promise<TrackURLData | undefined> {
		if (!this.currentUser?.license_token) return undefined;

		const tracksUrls = await this.media
			.getTrackUrls([trackToken], this.currentUser.license_token, format)
			.then(urls => urls[0])
			.catch(() => undefined);

		if (!tracksUrls) return undefined;

		// Throw error if not is WRONG_GEOLOCATION
		if (tracksUrls.errors && tracksUrls.errors.length && tracksUrls.errors?.[0]?.code !== DeezerExceptionCodes.WRONG_GEOLOCATION)
			throw new WrongGeolocation(this.currentUser?.country);
		else if (tracksUrls.errors && tracksUrls.errors.length && tracksUrls.errors?.[0]?.code)
			throw new DeezerException(`Failed to get track URL by token: ${trackToken}.`);

		return tracksUrls;
	}

	/**
	 * Finds track URLs based on the provided tokens, your license token, and format
	 *
	 * - But you must manage the geolocation or generic deezer error for each track.
	 */
	public getTracksByUrls(trackTokens: string[], format: string): Promise<TrackURLData[]> {
		if (!this.currentUser?.license_token) return Promise.resolve([]);

		return this.media.getTrackUrls(trackTokens, this.currentUser.license_token, format).catch(() => []);
	}
}
