import type { Deezlp } from 'deezlp';
import type { LoggerService } from './logger.service';
import type { PromptService } from './prompt.service';
import type { FileService } from './file.service';

export class LoginService {

	constructor(
		private readonly dl: Deezlp,
		private readonly logger: LoggerService,
		private readonly fileService: FileService,
		private readonly promptService: PromptService,
	) {
	}

	async loginViaArl() {
		if (this.dl.loggedIn) {
			this.logger.warn('You are already logged in.');
			return Promise.resolve(this.dl.loggedIn);
		}

		// 1. Read arl
		let savedArl = this.fileService.loadARL();

		if (!savedArl) savedArl = await this.promptService.askArl();

		// 2. Try to login with the arl
		try {
			const isLogged = await this.dl.loginViaArl(savedArl);

			if (isLogged) {
				// 3. Save the arl for future logins
				this.logger.success('Login successful!');
				this.fileService.saveARL(savedArl);
				return isLogged;
			} else {
				// 4. Remove the invalid arl
				this.fileService.removeARL();
				this.logger.error('Login failed, invalid ARL.');

				return isLogged;
			}
		} catch (error) {
			this.logger.error(`Login failed: ${error}`);

			// 5. Remove the invalid arl
			this.fileService.removeARL();
			this.logger.error('Login failed, invalid ARL.');
			return false;
		}
	}
}
