import { Command } from 'commander';
import { bootstrapCli } from './bootstrap';
import packageJson from '../../package.json' with { type: 'json' };

/**
 * Creates the CLI program with all available commands
 *
 * available commands:
 *  - download
 *  - login
 *  - logout
 *  - search
 * @returns {Command}
 */
export function createCli(): Command {
	const program = new Command();

	program.name('deezlp-cli').description('A CLI wrapper for deezlp').version(packageJson.version);

	const { downloadService } = bootstrapCli();

	// download command
	program
		.command('download')
		.description('Download tracks or albums')
		.argument('<urls...>', 'The URLs of the track or album')
		.option('-p, --path <path>', 'Downloads in the given folder')
		.option('-b, --bitrate <type>', 'Overrides the default bitrate selected - 128, 320, flac')
		.option('--portable', 'Creates the config folder in the same directory where the script is launched')
		.action(async (urls: string[], options: any) => {
			downloadService.executeDownload(urls, options);
		});

	return program;
}
