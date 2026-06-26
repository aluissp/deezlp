/**
 * Deezer API error codes mapped by constant name to numeric code.
 *
 * You can check the error codes here: https://developers.deezer.com/api/errors
 */
export enum DeezerExceptionCodes {
	/** Type: Exception */
	QUOTA = 4,
	/** Type: Exception */
	ITEMS_LIMIT_EXCEEDED = 100,
	/** Type: OAuthException */
	PERMISSION = 200,
	/** Type: OAuthException */
	TOKEN_INVALID = 300,
	/** Type: ParameterException*/
	PARAMETER = 500,
	/** Type: MissingParameterException */
	PARAMETER_MISSING = 501,
	/** Type: InvalidQueryException */
	QUERY_INVALID = 600,
	/** Type: Exception */
	SERVICE_BUSY = 700,
	/** Type: DataException */
	DATA_NOT_FOUND = 800,
	/** Type: IndividualAccountChangedNotAllowedException */
	INDIVIDUAL_ACCOUNT_NOT_ALLOWED = 901,
	/** Type: Exception thrown https://media.deezer.com/v1 api. */
	WRONG_GEOLOCATION = 2002,
}
