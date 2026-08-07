import { Command, Option } from 'commander';
import { bootstrapCli } from './bootstrap';
import packageJson from '../../package.json' with { type: 'json' };

/**
 * Creates the CLI program with all available commands
 *
 * available commands:
 *  - download
 *  - login
 *  - config
 * @returns {Command}
 */
export function createCli(): Command {
	const program = new Command();

	program.name('deezlp-cli').description('A CLI wrapper for deezlp').version(packageJson.version);

	const { downloadService, configService, loginService, lyricsParserService } = bootstrapCli();

	// download command
	program
		.command('download')
		.description('Download tracks or albums')
		.argument('<urls...>', 'The URLs of the track or album')
		.option('-p, --path <path>', 'Downloads in the given folder')
		.option('-b, --bitrate <bitrate>', 'Overrides the default bitrate selected - 128, 320, flac')
		.option('--portable', 'Creates the config folder in the same directory where the script is launched')
		.action(async (urls: string[], options: any) => downloadService.executeDownload(urls, options));

	// config command
	program
		.command('config')
		.description('Configure download settings')
		.option('-p, --path <path>', 'Downloads in the given folder')
		.option('-b, --bitrate <bitrate>', 'Overrides the default bitrate selected - 128, 320, flac')
		.option('-s, --show', 'Shows the current configuration')
		.addOption(new Option('--sl, --synclyrics <yes|no>', 'Enable syncs lyrics with the downloaded tracks').choices(['yes', 'no']))
		.addOption(new Option('--tsl, --tagsynclyrics <yes|no>', 'Tags the downloaded tracks with the synced lyrics').choices(['yes', 'no']))
		.action((options: any) => configService.execute(options));

	// login command
	program
		.command('login')
		.description('Login to your Deezer account')
		.option('-a, --arl <arl>', 'The ARL token for login')
		.option('-l, --logout', 'Logout from your Deezer account')
		.action((options: any) => loginService.execute(options));

	// parse lrc command
	program
		.command('lrc')
		.description('Parse lrc JSON lyrics')
		.argument('<filePaths...>', 'The jsonFiles paths of the lrc lyrics')
		.action((filePaths: string[]) => lyricsParserService.execute(filePaths));

	return program;
}
