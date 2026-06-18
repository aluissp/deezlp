import fs from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const homePath = homedir();

export const getConfigFolder = (): string => {
	const configPath = join(homePath, '.config', 'deezer');

	if (!fs.existsSync(configPath)) fs.mkdirSync(configPath, { recursive: true });

	return configPath;
};
