import { homedir } from 'os';
import fs, { type PathLike } from 'fs';
import { execSync } from 'child_process';
import { join, normalize, sep } from 'path';

let musicData = '';
const homePath = homedir();
const userDirsFile = join(homePath, '.config', 'user-dirs.dirs');

export function canWrite(path: PathLike): boolean {
	try {
		fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
	} catch {
		return false;
	}
	return true;
}

function checkPath(path: string) {
	if (path === '') return '';
	if (!fs.existsSync(path)) return '';
	if (!canWrite(path)) return '';
	return path;
}

export const getConfigFolder = (): string => {
	const configPath = join(homePath, '.config', 'deezer');

	if (!checkPath(configPath)) fs.mkdirSync(configPath, { recursive: true });

	return configPath;
};

export function getMusicFolder() {
	if (musicData) return musicData;

	if (process.env.DEEMIX_MUSIC_DIR) return process.env.DEEMIX_MUSIC_DIR.replace(/\/*$/, '') + sep;

	if (process.env.XDG_MUSIC_DIR && musicData === '') {
		musicData = `${process.env.XDG_MUSIC_DIR}${sep}`;
		musicData = checkPath(musicData);
	}

	if (process.platform === 'win32' && musicData === '') {
		try {
			const musicKeys = ['My Music', '{4BD8D571-6D19-48D3-BE97-422220080E43}'];
			const regData = execSync('reg.exe query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders"')
				.toString()
				.split('\r\n');
			for (let i = 0; i < regData.length; i++) {
				const line = regData[i];
				if (line === '') continue;
				if (i === 1) continue;
				const lines = line?.split('    ');
				if (musicKeys.includes(lines?.[1] || '')) {
					musicData = lines?.[3] + sep;
					break;
				}
			}
			musicData = checkPath(musicData);
		} catch {
			/* empty */
		}
	}

	if (fs.existsSync(userDirsFile) && musicData === '') {
		const file = fs.readFileSync(userDirsFile, 'utf8');

		const musicDir = file.match(/^XDG_MUSIC_DIR="([^"]+)"/m)?.[1];

		if (musicDir) musicData = checkPath(normalize(musicDir.replace('$HOME', homePath))) + sep;
	}

	if (musicData === '') {
		musicData = `${homePath}${sep}Music${sep}`;
		musicData = checkPath(musicData);
	}

	if (musicData === '') musicData = `${process.cwd()}${sep}music${sep}`;
	else musicData += `Deezlp Music${sep}`;

	return musicData;
}
