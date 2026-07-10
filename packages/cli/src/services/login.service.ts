import type { Deezlp } from 'deezlp';
import type { LoggerService } from './logger.service';

export class LoginService {
	/** Indicates if the user is logged in */
	private readonly loggedIn: boolean;

	constructor(
		private readonly dl: Deezlp,
		private readonly logger: LoggerService,
	) {
		this.loggedIn = this.dl.loggedIn;
	}

	loginViaArl() {
		if (this.loggedIn) {
			this.logger.warn('You are already logged in.');
			return Promise.resolve(this.loggedIn);
		}



		return this.dl.loginViaArl(arl);
	}
}
