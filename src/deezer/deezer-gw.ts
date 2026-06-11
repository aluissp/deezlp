import https from 'https';
import axios from 'axios';
import constants from './constants';
import type { AxiosInstance } from 'axios';

export class DeezerGW {
	private api: AxiosInstance;
	// private arl: string;

	constructor(arl: string) {
		// this.arl = arl;
		const httpsAgent = new https.Agent({
			rejectUnauthorized: false,
		});
		this.api = axios.create({
			baseURL: constants.DEEZER_GW_URL,
			timeout: 5000, // 5 seconds timeout for all requests
			headers: {
				Cookie: `arl=${arl}`,
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			},
			httpsAgent,
		});
	}

	async call(method: string, data: object) {
		data ??= {};

		try {
			const response = await this.api.post('/', data, {
				params: {
					method,
					api_version: 1.0,
				},
			});

			if (response.data?.error) {
				throw new Error(`Deezer GW Error: ${response.data.error.message}`);
			}

			return response.data;
		} catch (error) {
			console.error('Error calling Deezer GW:', error);
			throw new Error('An error occurred while calling the Deezer Gateway.');
		}
	}

	async getTrackPageData(trackId: number) {
		const response = await this.call('deezer.pageTrack', {
			sng_id: trackId,
		});

		return response;
	}
}
