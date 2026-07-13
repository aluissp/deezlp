import pc from 'picocolors';
import { join } from 'path';
import { getConfigFolder } from 'deezer';
import { createLogger, format, transports, Logger } from 'winston';

export class LoggerService {
	private readonly logger: Logger;
	private readonly levels = {
		error: 0,
		warn: 1,
		success: 2,
		info: 3,
		debug: 4,
	};

	constructor(logDirectory?: string) {
		if (!logDirectory) logDirectory = getConfigFolder();

		this.logger = createLogger({
			level: 'info',
			levels: this.levels,
			transports: [
				// 1. Save all logs in a file (combined.log)
				new transports.File({
					filename: join(logDirectory, 'combined.log'),
					format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()),
					maxFiles: 5,
					maxsize: 5 * 1024 * 1024, // 5MB
				}),
				// 2. Save only error logs in a separate file (error.log)
				new transports.File({
					filename: join(logDirectory, 'error.log'),
					level: 'error',
					format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()),
					maxFiles: 5,
					maxsize: 5 * 1024 * 1024, // 5MB
				}),
				// 3. Log to the console
				new transports.Console({
					format: format.combine(
						format.printf(info => {
							const { level, message } = info as { level: string; message: string };

							const msgFormats: Record<string, string> = {
								info: `${pc.blue('[INFO]:')} ${message}`,
								success: `${pc.green('[SUCCESS]:')} ${message}`,
								error: `${pc.red('[ERROR]:')} ${pc.red(message)}`,
								warn: `${pc.yellow('[WARN]:')} ${message}`,
							};

							return msgFormats[level] ?? `${pc.gray(`[${level.toUpperCase()}]:`)} ${message}`;
						}),
					),
				}),
			],
		});
	}

	info(message: string): void {
		this.logger.info(message);
	}

	success(message: string): void {
		this.logger.info(message);
	}

	warn(message: string): void {
		this.logger.warn(message);
	}

	error(message: string): void {
		this.logger.error(message);
	}
}
