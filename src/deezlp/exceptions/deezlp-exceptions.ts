export class DeezlpException extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'DeezlpException';
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

export class LinkNotRecognized extends GenerationException {
	errId: string;

	constructor(link: string) {
		super(link, 'Link is not recognized');
		this.name = 'LinkNotRecognized';
		this.errId = 'invalidURL';
	}
}
