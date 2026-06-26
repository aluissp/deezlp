import got, { type Got } from 'got';
import type { CookieJar } from 'tough-cookie';
import { DEEZER_URLS } from './constants';
import type { TrackURLData } from './interfaces';
import { DeezerException } from './exceptions';

export class DeezerMedia {
	private api: Got;

	cookieJar: CookieJar;
	headers: Record<string, string>;

	constructor(cookieJar: CookieJar, headers: Record<string, string>) {
		this.cookieJar = cookieJar;
		this.headers = headers;

		this.api = got.extend({
			prefixUrl: DEEZER_URLS.DEEZER_MEDIA_URL,
			headers: this.headers,
			cookieJar: this.cookieJar,
			https: { rejectUnauthorized: false },
		});
	}

	async getTrackUrls(trackTokens: string[], licenseToken: string, format: string): Promise<TrackURLData[]> {
		try {
			const response = await this.api
				.post('get_url', {
					json: {
						license_token: licenseToken,
						track_tokens: trackTokens,
						media: [{ type: 'FULL', formats: [{ cipher: 'BF_CBC_STRIPE', format }] }],
					},
				})
				.json<{ data: TrackURLData[] }>();

			return response.data;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			throw new DeezerException(`Failed to get track URLs by tokens: ${trackTokens.join(', ')}. Error: ${errorMessage}`);
		}
	}
}
