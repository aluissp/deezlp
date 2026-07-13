import { join, sep } from 'path';
import { getConfigFolder } from 'deezer';
import type { Settings } from 'deezlp';
import { DEFAULT_SETTINGS } from 'deezlp/src/constants';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';

export class FileService {
	private configPath: string;

	constructor(isPortable?: boolean) {
		this.configPath = isPortable ? join(process.cwd(), 'config' + sep) : getConfigFolder();
	}

	loadConfigPath(isPortable: boolean): string {
		this.configPath = isPortable ? join(process.cwd(), 'config' + sep) : getConfigFolder();
		return this.configPath;
	}

	loadSettings(): Settings {
		if (!existsSync(this.configPath)) mkdirSync(this.configPath, { recursive: true });

		const configFilePath = join(this.configPath, 'config.json');
		// 1. Save default settings if the config file doesn't exist
		if (!existsSync(configFilePath)) this.saveSettings(DEFAULT_SETTINGS);

		try {
			return JSON.parse(readFileSync(configFilePath, 'utf-8').toString());
		} catch (error: any) {
			// 2. If the config file is corrupted, save default settings and return them
			if (error.name === 'SyntaxError') this.saveSettings(DEFAULT_SETTINGS);

			return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
		}
	}

	saveSettings(settings: Settings): void {
		if (!existsSync(this.configPath)) mkdirSync(this.configPath, { recursive: true });

		const configFilePath = join(this.configPath, 'config.json');
		const configData = JSON.stringify(settings, null, 2);
		writeFileSync(configFilePath, configData, 'utf-8');
	}

	saveARL(arl: string): void {
		if (!existsSync(this.configPath)) mkdirSync(this.configPath, { recursive: true });

		const arlFilePath = join(this.configPath, '.arl');
		writeFileSync(arlFilePath, arl, 'utf-8');
	}

	removeARL(): void {
		if (!existsSync(this.configPath)) mkdirSync(this.configPath, { recursive: true });

		const arlFilePath = join(this.configPath, '.arl');
		if (!existsSync(arlFilePath)) return;

		rmSync(arlFilePath, { force: true });
	}

	loadARL(): string | undefined {
		if (!existsSync(this.configPath)) mkdirSync(this.configPath, { recursive: true });

		const arlFilePath = join(this.configPath, '.arl');
		if (!existsSync(arlFilePath)) return;

		return readFileSync(arlFilePath, 'utf-8').toString();
	}
}
