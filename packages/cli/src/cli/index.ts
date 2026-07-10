import { Command } from 'commander';
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

	// download command
	program
		.argument('<url>', 'The URL of the track or album')
		.option('-p, --path <path>', 'Downloads in the given folder')
		.option('-b, --bitrate <type>', 'Overrides the default bitrate selected - 128, 320, flac')
		.option('--portable', 'Creates the config folder in the same directory where the script is launched');
	// .action();

	return program;
}
