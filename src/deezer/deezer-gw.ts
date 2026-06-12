import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { CookieJar } from 'tough-cookie';
import { HttpsCookieAgent } from 'http-cookie-agent/http';
import { DEEZER_GW_METHODS, DEEZER_URLS } from './constants';
import type { GWRawData, GWUserData } from './interfaces';
import { GWAPIException } from './exceptions';

export class DeezerGW {
	private api: AxiosInstance;
	private apiToken?: string;

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
			baseURL: DEEZER_URLS.DEEZER_GW_URL,
			timeout: 5000, // 5 seconds timeout for all requests
			headers: this.headers,
			withCredentials: true,
			httpsAgent,
		});
	}

	async call(method: string, args?: any, params?: any): Promise<unknown> {
		// 1. Ensure args and params are always objects
		args ??= {};
		params ??= {};

		// 2. If doesn't have token and method is distinct than `deezer.getUserData`
		if (!this.apiToken && method !== DEEZER_GW_METHODS.GET_USER_DATA) this.apiToken = await this.getToken();

		// 3. Build search params
		const searchParams = {
			method,
			input: '3',
			api_version: '1.0',
			api_token: method === DEEZER_GW_METHODS.GET_USER_DATA ? 'null' : this.apiToken,
			...params,
		};

		try {
			// 4. Make API call
			const { data } = await this.api.post<GWRawData>('', args, { params: searchParams });

			// 5. Handle token errors and retry once if needed
			if (data.error && (data.error?.length || Object.keys(data?.error).length)) {
				if (
					JSON.stringify(data.error) === '{"GATEWAY_ERROR":"invalid api token"}' ||
					JSON.stringify(data.error) === '{"VALID_TOKEN_REQUIRED":"Invalid CSRF token"}'
				) {
					this.apiToken = await this.getToken();
					return this.call(method, args, params);
				}
			}

			// 6. Extract results, then extract token if method is `deezer.getUserData` and return results
			const results = data.results as { checkForm?: string };

			if (!this.apiToken && method === DEEZER_GW_METHODS.GET_USER_DATA) this.apiToken = results.checkForm;

			return results;
		} catch (error: any) {
			console.error('[ERROR] deezer.gw', method, args, error.name, error.message);

			// Check if error is AxiosError
			if (!axios.isAxiosError(error))
				throw new GWAPIException(`${method} ${args}:: ${error?.name ?? 'Unknown error'}: ${error?.message ?? 'Unknown error'}`);

			if (!['ECONNABORTED', 'ECONNREFUSED', 'ECONNRESET', 'ENETRESET', 'ETIMEDOUT'].includes(error.code ?? ''))
				throw new GWAPIException(`${method} ${args}:: ${error.name}: ${error.message}`);

			// Await 2 seconds before retrying
			console.warn(`[WARN] Retrying ${method} ${args} after error: ${error.code}. Attempting to recover...`);
			await new Promise(resolve => setTimeout(resolve, 2000));
			return this.call(method, args, params);
		}
	}

	private async getToken(): Promise<string> {
		const userData = await this.getUserData();
		return userData?.checkForm;
	}

	async getUserData(): Promise<GWUserData> {
		return this.call(DEEZER_GW_METHODS.GET_USER_DATA) as Promise<GWUserData>;
	}
}
