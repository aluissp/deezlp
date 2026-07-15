import { Deezlp } from 'deezlp';
import { ConfigService, DownloadService, FileService, LoggerService, LoginService, PromptService } from '@/services';

export function bootstrapCli() {
	const dl = new Deezlp();
	const fileService = new FileService();
	const promptService = new PromptService();
	const logger = new LoggerService();

	// command services
	const loginService = new LoginService(dl, logger, fileService, promptService);
	const downloadService = new DownloadService(dl, logger, fileService, loginService);
	const configService = new ConfigService(fileService, logger);

	return { loginService, downloadService, configService, fileService };
}
