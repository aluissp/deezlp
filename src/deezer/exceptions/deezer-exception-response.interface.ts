/**
 * DeezerExceptionResponse represents the structure of an error response from the Deezer API.
 */
export interface DeezerExceptionResponse {
	type?: string;
	message?: string;
	code?: number;
}
