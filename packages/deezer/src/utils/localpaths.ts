import { homedir } from 'os';
import { join, sep } from 'path';
import fs, { type PathLike } from 'fs';
import { execSync } from 'child_process';

const homePath = homedir();

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
	let musicdata = '';

	if (process.env.DEEMIX_MUSIC_DIR) return process.env.DEEMIX_MUSIC_DIR.replace(/\/*$/, '') + '/';

	if (process.env.XDG_MUSIC_DIR && musicdata === '') {
		musicdata = `${process.env.XDG_MUSIC_DIR}${sep}`;
		musicdata = checkPath(musicdata);
	}

	if (process.platform === 'win32' && musicdata === '') {
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
					musicdata = lines?.[3] + sep;
					break;
				}
			}
			musicdata = checkPath(musicdata);
		} catch {
			/* empty */
		}
	}
	if (musicdata === '') {
		musicdata = `${homePath}${sep}Music${sep}`;
		musicdata = checkPath(musicdata);
	}

	if (musicdata === '') musicdata = `${process.cwd()}${sep}music${sep}`;
	else musicdata += `deezlp Music${sep}`;

	return musicdata;
}
