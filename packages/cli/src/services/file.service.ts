import { join, sep } from 'path';
import { getConfigFolder } from 'deezer';
import type { Settings } from 'deezlp';

export class FileService {
	private readonly configPath: string;

	constructor(isPortable: boolean) {
		this.configPath = isPortable ? join(process.cwd(), 'config' + sep) : getConfigFolder();
	}

	// loadSettings(): Settings {}
}
