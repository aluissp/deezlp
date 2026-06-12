import axios from 'axios';
import constants from './constants';
import type { AxiosInstance } from 'axios';
import type { CookieJar } from 'tough-cookie';
import { HttpsCookieAgent } from 'http-cookie-agent/http';

export class DeezerGW {
	private api: AxiosInstance;
	private apiToken: string | null = null;

	cookieJar: CookieJar;
	headers: Record<string, string>;

	constructor(cookieJar: CookieJar, headers: Record<string, string>) {
		this.cookieJar = cookieJar;
		this.headers = headers;

		const httpsAgent = new HttpsCookieAgent({
			cookies: { jar: cookieJar },
			rejectUnauthorized: false,
			keepAlive: true,
		});

		this.api = axios.create({
			baseURL: constants.DEEZER_GW_URL,
			timeout: 5000, // 5 seconds timeout for all requests
			headers: this.headers,
			withCredentials: true,
			httpsAgent,
		});
	}

	async call(method: string, args?: any, params?: any) {
		// 1. Ensure args and params are always objects
		args ??= {};
		params ??= {};

		// 2. If doesn't have token and method is distinct than `deezer.getUserData`
		if (!this.apiToken && method !== 'deezer.getUserData') this.apiToken = await this.getToken();

		// 3. Build search params
		const searchParams = {
			api_version: '1.0',
			api_token: method === 'deezer.getUserData' ? 'null' : this.apiToken,
			input: '3',
			method,
			...params,
		};

		try {
			const response = await this.api.post('', args, { params: searchParams });
			// if (response.data?.error) {
			// 	throw new Error(`API Error: ${response.data.error.message}`);
			// }
			return response.data;
		} catch (error) {
			console.error(`Error calling method ${method}:`, error);
			throw error;
		}
	}

	private async getToken(): Promise<string> {
		const tokenData = await this.getUserData();
		return tokenData?.checkForm;
	}
	async getUserData() {
		return this.call('deezer.getUserData');
	}
}
