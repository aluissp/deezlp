import { api } from './api';
import { AxiosError, isAxiosError } from 'axios';
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

export class DeezerApiClient {
	async searchTrack(query: string) {
		const queryParams = `/search?q=${encodeURIComponent(query)}`;

		try {
			const response = await api.get(queryParams);

			if (!response.data?.error) return response.data;

			this.handleAPIError(response.data.error);
		} catch (error) {
			if (!(error instanceof AxiosError)) {
				console.error('An unexpected error occurred:', error);
				throw new Error('An unexpected error occurred while fetching data from Deezer API.');
			}

			if (!isAxiosError(error)) {
				console.error('An unexpected error occurred:', error);
				throw new Error('An unexpected error occurred while fetching data from Deezer API.');
			}

			if (error.code && ['ECONNABORTED', 'ECONNREFUSED', 'ECONNRESET', 'ENETRESET', 'ETIMEDOUT'].includes(error.code || '')) {
				// !Refactor: Implement retry logic with exponential backoff

				// `${endpoint} ${args}:: ${e.name}: ${e.message}`
				throw new APIException(`${error.name}: ${error.message} (code: ${error.code})`);
			}

			throw new Error('An unexpected error occurred while fetching data from Deezer API.');
		}
	}

	private handleAPIError(error: DeezerExceptionResponse) {
		if (!error?.code) throw new APIException(error?.message || 'An unknown error occurred while fetching data from Deezer API.');

		const message = error.message || '';

		if ([DeezerExceptionCodes.QUOTA, DeezerExceptionCodes.SERVICE_BUSY].includes(error.code)) {
			// !Refactor: Implement a retry logic
		}

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
