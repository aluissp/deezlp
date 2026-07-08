import { join } from 'path';
import { existsSync } from 'fs';
import { Deezlp } from '@/deezlp';
import { DownloadStatus } from '@/entities';
import { DEFAULT_SETTINGS } from '@/constants';
import { getMusicFolder, TRACK_FORMATS } from 'deezer';

describe('Testing the generateTrackItem function', () => {
	let deezlp: Deezlp;
	// const trackId = 105920318 // Gorriones
	const trackId = 1380101222; // Life goes on
	const isrcTrackId = 'USAT22007153'; // Life goes on
	const links = [
		'https://www.deezer.com/mx/track/99976952?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-99976952&deferredFl=1&universal_link=1',
		'https://www.deezer.com/mx/track/562774642?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-562774642&deferredFl=1&universal_link=1',
	];

	const musicFolder = getMusicFolder();
	const trackPath1 = join(musicFolder, 'Twenty One Pilots', 'Blurryface', 'Twenty One Pilots - Stressed Out.mp3');
	const trackPath2 = join(musicFolder, 'Twenty One Pilots', 'Trench', 'Twenty One Pilots - Jumpsuit.mp3');
	const lyricPath1 = join(musicFolder, 'Twenty One Pilots', 'Blurryface', 'Twenty One Pilots - Stressed Out.lrc');
	const lyricPath2 = join(musicFolder, 'Twenty One Pilots', 'Trench', 'Twenty One Pilots - Jumpsuit.lrc');

	beforeAll(async () => {
		deezlp = new Deezlp({
			...DEFAULT_SETTINGS,
			maxBitrate: TRACK_FORMATS.MP3_320,
			// downloadLocation: '/home/luis/Música/deemix Music',
			syncedLyrics: true,
		});
		await deezlp.loginViaArl(process.env.VITE_DEEZER_ARL_TOKEN || '');
	});

	test('Should download deezer tracks', async () => {
		const result = deezlp.download(links);

		await result.done;

		expect(result.jobs.length).toBe(2);
		expect(result.jobs?.[0]?.status).toBe(DownloadStatus.finished);
		expect(result.jobs?.[1]?.status).toBe(DownloadStatus.finished);
		expect(existsSync(trackPath1)).toBe(true);
		expect(existsSync(trackPath2)).toBe(true);
		expect(existsSync(lyricPath1)).toBe(true);
		expect(existsSync(lyricPath2)).toBe(true);
	}, 90000);
});
