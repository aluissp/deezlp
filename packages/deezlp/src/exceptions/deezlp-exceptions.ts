export class DeezlpException extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'DeezlpException';
	}
}

export class StrategyNotFoundException extends DeezlpException {
	constructor(message: string) {
		super(message);
		this.name = 'StrategyNotFoundException';
	}
}

export class GenerationException extends DeezlpException {
	link: string;

	constructor(link: string, message: string) {
		super(message);
		this.name = 'GenerationException';
		this.link = link;
	}
}

export class NotLoggedInException extends DeezlpException {
	constructor(message: string) {
		super(message);
		this.name = 'NotLoggedInException';
	}
}

export class LinkNotRecognized extends GenerationException {
	errId: string;

	constructor(link: string) {
		super(link, 'Link is not recognized');
		this.name = 'LinkNotRecognized';
		this.errId = 'invalidURL';
	}
}

export class LinkNotSupported extends GenerationException {
	errId: string;

	constructor(link: string) {
		super(link, 'Link is not supported');
		this.name = 'LinkNotSupported';
		this.errId = 'unsupportedURL';
	}
}

export class InvalidID extends GenerationException {
	errid: string;

	constructor(link: string) {
		super(link, 'Link ID is invalid!');
		this.name = 'InvalidID';
		this.errid = 'invalidID';
	}
}

export class ISRCnotOnDeezer extends GenerationException {
	errid: string;

	constructor(link: string) {
		super(link, 'Track ISRC not found on Deezer!');
		this.name = 'ISRCnotOnDeezer';
		this.errid = 'ISRCnotOnDeezer';
	}
}

export class DownloadEmpty extends DeezlpException {
	constructor() {
		super();
		this.name = 'DownloadEmpty';
	}
}

export class DownloadCanceled extends DeezlpException {
	constructor() {
		super();
		this.name = 'DownloadCanceled';
	}
}
export class TrackAlreadyDownloaded extends DeezlpException {
	constructor(message?: string) {
		super(message);
		this.name = 'TrackAlreadyDownloaded';
	}
}

export class TrackMediaNotFound extends DeezlpException {
	constructor() {
		super();
		this.name = 'TrackMediaNotFound';
	}
}
