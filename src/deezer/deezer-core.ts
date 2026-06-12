import { Cookie, CookieJar } from 'tough-cookie';
import { DeezerGW } from './deezer-gw';

export class DeezerCore {
	gw: DeezerGW;
	cookieJar: CookieJar;
	httpHeaders: { 'User-Agent': string };

	constructor() {
		this.httpHeaders = {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
		};
		this.cookieJar = new CookieJar();
		this.gw = new DeezerGW(this.cookieJar, this.httpHeaders);
	}

	async loginViaArl(arl: string) {
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
	}
}
