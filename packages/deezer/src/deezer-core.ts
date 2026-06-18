import { Cookie, CookieJar } from 'tough-cookie';
import { DeezerGW } from './deezer-gw';
import type { GWUserData, UserCore } from './interfaces';
import { DeezerApi } from './deezer-api';

export class DeezerCore {
	/** The Deezer gateway instance */
	gw: DeezerGW;
	/** The Deezer api instance */
	api: DeezerApi;
	/** Indicates if the user is logged in */
	loggedIn: boolean;
	/** Refers to the list of child users */
	children: UserCore[];
	/** The cookie jar for managing cookies */
	cookieJar: CookieJar;
	httpHeaders: { 'User-Agent': string };

	constructor() {
		this.httpHeaders = {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
		};
		this.children = [];
		this.loggedIn = false;
		this.cookieJar = new CookieJar();
		this.gw = new DeezerGW(this.cookieJar, this.httpHeaders);
		this.api = new DeezerApi(this.cookieJar, this.httpHeaders);
	}

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
}
