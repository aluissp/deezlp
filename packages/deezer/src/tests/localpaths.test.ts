import { getMusicFolder } from '@/utils';

describe('Testing the localpaths util functions', () => {
	test('Should build correct music folder', () => {
		const musicFolder = getMusicFolder();
		const musicFolder2 = getMusicFolder();

		expect(musicFolder).toBeDefined();

		const lang = process.env.LANG || process.env.LANGUAGE;

		const linuxMusicFolder = lang?.startsWith('es') ? '/home/luis/Música/Deezlp Music/' : '/home/luis/Music/Deezlp Music/';

		if (process.platform === 'linux') expect(musicFolder).toBe(linuxMusicFolder);
		if (process.platform === 'linux') expect(musicFolder2).toBe(linuxMusicFolder);
	});
});
