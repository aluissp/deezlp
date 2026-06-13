import got from 'got';
import type { Got } from 'got';
import {
	APIException,
	DataNotFoundException,
	DeezerExceptionCodes,
	IndividualAccountChangedNotAllowedException,
	ItemsLimitExceededException,
	ParameterException,
	ParameterMissingException,
	PermissionException,
	QueryInvalidException,
	TokenInvalidException,
	type DeezerExceptionResponse,
} from './exceptions';
import { DEEZER_URLS } from './constants';
import type { CookieJar } from 'tough-cookie';

type APIArgs = Record<string | number, string | number>;

export class DeezerApi {
	private api: Got;

	headers: Record<string, string>;
	cookieJar: CookieJar;
	// access_token?: string;

	constructor(cookieJar: CookieJar, headers: Record<string, string>) {
		this.headers = headers;
		this.cookieJar = cookieJar;

		this.api = got.extend({
			prefixUrl: DEEZER_URLS.DEEZER_API_URL,
			headers: this.headers,
			cookieJar: this.cookieJar,
			https: { rejectUnauthorized: false },
		});
	}

	private async call(endpoint: string, args: APIArgs = {}): Promise<unknown> {
		try {
			const response = await this.api.get(endpoint, { searchParams: args }).json<any>();

			if (!response?.error) return response;

			await this.handleAPIError(response.error, endpoint, args);
		} catch (error: any) {
			if (error.code && ['ECONNABORTED', 'ECONNREFUSED', 'ECONNRESET', 'ENETRESET', 'ETIMEDOUT'].includes(error.code || '')) {
				await this.retryCall(endpoint, args);

				// `${endpoint} ${args}:: ${e.name}: ${e.message}`
				throw new APIException(`${endpoint} ${args}:: ${error.name}: ${error.message} (code: ${error.code})`);
			}

			throw new Error('An unexpected error occurred while fetching data from Deezer API.');
		}
	}

	private async retryCall(endpoint: string, args: APIArgs = {}, delay = 2000): Promise<unknown> {
		await new Promise(resolve => setTimeout(resolve, delay));

		return this.call(endpoint, args);
	}

	private async handleAPIError(error: DeezerExceptionResponse, endpoint: string, args: APIArgs = {}) {
		if (!error?.code) throw new APIException(error?.message || 'An unknown error occurred while fetching data from Deezer API.');

		const message = error.message || '';

		// Retry the call for quota and service busy errors
		if ([DeezerExceptionCodes.QUOTA, DeezerExceptionCodes.SERVICE_BUSY].includes(error.code)) await this.retryCall(endpoint, args);

		if (error.code === DeezerExceptionCodes.ITEMS_LIMIT_EXCEEDED) throw new ItemsLimitExceededException(`ItemsLimitExceededException: ${message}`);

		if (error.code === DeezerExceptionCodes.PERMISSION) throw new PermissionException(`PermissionException: ${message}`);

		if (error.code === DeezerExceptionCodes.TOKEN_INVALID) throw new TokenInvalidException(`TokenInvalidException: ${message}`);

		if (error.code === DeezerExceptionCodes.PARAMETER) throw new ParameterException(`ParameterException: ${message}`);

		if (error.code === DeezerExceptionCodes.PARAMETER_MISSING) throw new ParameterMissingException(`ParameterMissingException: ${message}`);

		if (error.code === DeezerExceptionCodes.QUERY_INVALID) throw new QueryInvalidException(`QueryInvalidException: ${message}`);

		if (error.code === DeezerExceptionCodes.DATA_NOT_FOUND) throw new DataNotFoundException(`DataNotFoundException: ${message}`);

		if (error.code === DeezerExceptionCodes.INDIVIDUAL_ACCOUNT_NOT_ALLOWED)
			throw new IndividualAccountChangedNotAllowedException(`IndividualAccountChangedNotAllowedException: ${message}`);
	}
}
