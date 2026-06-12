export class DeezerException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'DeezerException';
	}
}

/**
 * Generic APIException for errors related to Deezer API interactions.
 */
export class APIException extends DeezerException {
	constructor(message: string) {
		super(message);
		this.name = 'APIException';
	}
}

/**
 * QuotaException
 * - Constant: QUOTA
 * - Type: Exception
 * - Code: 4
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class QuotaException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'QuotaException';
	}
}

/**
 * ItemsLimitExceededException
 * - Constant: ITEMS_LIMIT_EXCEEDED
 * - Type: Exception
 * - Code: 100
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class ItemsLimitExceededException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'ItemsLimitExceededException';
	}
}

/**
 * PermissionException
 * - Constant: PERMISSION
 * - Type: OAuthException
 * - Code: 200
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class PermissionException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'PermissionException';
	}
}

/**
 * TokenInvalidException
 * - Constant: TOKEN_INVALID
 * - Type: OAuthException
 * - Code: 300
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class TokenInvalidException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'TokenInvalidException';
	}
}

/**
 * ParameterException
 * - Constant: PARAMETER
 * - Type: ParameterException
 * - Code: 500
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class ParameterException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'ParameterException';
	}
}

/**
 * ParameterMissingException
 * - Constant: PARAMETER_MISSING
 * - Type: MissingParameterException
 * - Code: 501
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class ParameterMissingException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'ParameterMissingException';
	}
}

/**
 * QueryInvalidException
 * - Constant: QUERY_INVALID
 * - Type: InvalidQueryException
 * - Code: 600
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class QueryInvalidException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'QueryInvalidException';
	}
}

/**
 * ServiceBusyException
 * - Constant: SERVICE_BUSY
 * - Type: Exception
 * - Code: 700
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class ServiceBusyException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'ServiceBusyException';
	}
}

/**
 * DataNotFoundException
 * - Constant: DATA_NOT_FOUND
 * - Type: DataException
 * - Code: 800
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class DataNotFoundException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'DataNotFoundException';
	}
}

/**
 * IndividualAccountChangedNotAllowedException
 * - Constant: INDIVIDUAL_ACCOUNT_NOT_ALLOWED
 * - Type: IndividualAccountChangedNotAllowedException
 * - Code: 901
 *
 * Source: https://developers.deezer.com/api/errors
 */
export class IndividualAccountChangedNotAllowedException extends APIException {
	constructor(message: string) {
		super(message);
		this.name = 'IndividualAccountChangedNotAllowedException';
	}
}

export class GWAPIException extends DeezerException {
	constructor(message: string) {
		super(message);
		this.name = 'GWAPIException';
		this.message = 'Track unavailable on Deezer';
	}
}
