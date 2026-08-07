import { join } from 'path';
import { Deezlp } from '@/deezlp';
import rootLrc from './root.json';
import { existsSync, unlinkSync } from 'fs';
import { DownloadStatus } from '@/entities';
import { DEFAULT_SETTINGS } from '@/constants';
import { getMusicFolder, TRACK_FORMATS } from 'deezer';
import { beforeAll, describe, expect, test } from 'bun:test';

describe('Testing the Deezlp class', () => {
	let deezlp: Deezlp;
	let token: string = process.env.DEEZER_ARL_TOKEN || '';

	// const trackId = 105920318 // Gorriones
	// const trackId = 1380101222; // Life goes on
	// const isrcTrackId = 'USAT22007153'; // Life goes on
	const links = [
		'https://www.deezer.com/mx/track/99976952?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-99976952&deferredFl=1&universal_link=1',
		'https://www.deezer.com/mx/track/562774642?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-562774642&deferredFl=1&universal_link=1',
	];

	/** Deftones - Adrenaline album link */
	const albumLink =
		'https://www.deezer.com/mx/album/91101?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=album-91101&deferredFl=1';

	const musicFolder = getMusicFolder();
	const trackPath1 = join(musicFolder, 'Twenty One Pilots', 'Blurryface', 'Twenty One Pilots - Stressed Out.mp3');
	const trackPath2 = join(musicFolder, 'Twenty One Pilots', 'Trench', 'Twenty One Pilots - Jumpsuit.mp3');
	const lyricPath1 = join(musicFolder, 'Twenty One Pilots', 'Blurryface', 'Twenty One Pilots - Stressed Out.lrc');
	const lyricPath2 = join(musicFolder, 'Twenty One Pilots', 'Trench', 'Twenty One Pilots - Jumpsuit.lrc');

	beforeAll(async () => {
		deezlp = new Deezlp({
			...DEFAULT_SETTINGS,
			maxBitrate: TRACK_FORMATS.MP3_128,
			syncedLyrics: true,
		});

		await deezlp.loginViaArl(token);
	});

	/** Disabled for test with 320kbps, enabled if you doesn't have premium account */
	// test('Should download deezer 128kbps tracks', async () => {
	// 	// config settings for 128kbps
	// 	deezlp.setSettings({
	// 		maxBitrate: TRACK_FORMATS.MP3_128,
	// 		tagFile: true,
	// 		syncedLyrics: true,
	// 		overwriteFile: false,
	// 	});

	// 	const result = deezlp.download(links);

	// 	await result.done;

	// 	expect(result.jobs.length).toBe(2);
	// 	expect(result.jobs?.[0]?.status).toBe(DownloadStatus.finished);
	// 	expect(result.jobs?.[1]?.status).toBe(DownloadStatus.finished);
	// 	expect(existsSync(trackPath1)).toBe(true);
	// 	expect(existsSync(trackPath2)).toBe(true);
	// 	expect(existsSync(lyricPath1)).toBe(true);
	// 	expect(existsSync(lyricPath2)).toBe(true);
	// }, 90000);

	test('Should download deezer 320kbps tracks', async () => {
		// config settings for 320kbps
		deezlp.setSettings({
			maxBitrate: TRACK_FORMATS.MP3_320,
			tagFile: true,
			syncedLyrics: true,
			overwriteFile: false,
			tags: { ...DEFAULT_SETTINGS, syncedLyrics: true },
		});

		const result = deezlp.prepare(links);

		await result.start();

		expect(result.jobs.length).toBe(2);
		expect(result.jobs?.[0]?.status).toBe(DownloadStatus.finished);
		expect(result.jobs?.[1]?.status).toBe(DownloadStatus.finished);
		expect(existsSync(trackPath1)).toBe(true);
		expect(existsSync(trackPath2)).toBe(true);
		expect(existsSync(lyricPath1)).toBe(true);
		expect(existsSync(lyricPath2)).toBe(true);
	}, 90000);

	test('Should download deezer FLAC tracks', async () => {
		// config settings for FLAC
		deezlp.setSettings({
			maxBitrate: TRACK_FORMATS.FLAC,
			tagFile: true,
			syncedLyrics: true,
			overwriteFile: false,
		});

		const result = deezlp.prepare(links);

		await result.start();

		expect(result.jobs.length).toBe(2);
		expect(result.jobs?.[0]?.status).toBe(DownloadStatus.finished);
		expect(result.jobs?.[1]?.status).toBe(DownloadStatus.finished);
		expect(existsSync(trackPath1)).toBe(true);
		expect(existsSync(trackPath2)).toBe(true);
		expect(existsSync(lyricPath1)).toBe(true);
		expect(existsSync(lyricPath2)).toBe(true);
	}, 90000);

	test('Should download all files from an album', async () => {
		// config settings for 320kbps
		deezlp.setSettings({
			maxBitrate: TRACK_FORMATS.MP3_320,
			tagFile: true,
			syncedLyrics: true,
			overwriteFile: false,
			tracknameTemplate: '%tracknumber% - %title%',
		});

		const result = deezlp.prepare(albumLink);

		await result.start();

		expect(result.jobs.length).toBe(1);
		expect(result.jobs?.[0]?.status).toBe(DownloadStatus.finished);

		result.jobs.forEach(job => {
			expect(job.payload?.type).toBe('album');

			if (job.payload?.type !== 'album') return;

			job.payload?.downloadProgress.forEach(data => {
				expect(data.progressStatus).toBe('finished');
				expect(data.trackProgress).toBe(100);
				if (data.downloadPath) expect(existsSync(data.downloadPath)).toBe(true);
			});
		});
	}, 90000);

	test('Should parse json sync lyrics', async () => {
		// Clean file
		const filePath = '/home/luis/Música/Deezlp Music/Deftones/Adrenaline/06 - Root.lrc';
		if (existsSync(filePath)) unlinkSync(filePath);

		// Parse the root.json filed
		const { savedPath } = await deezlp.parseJsonSyncLyrics(JSON.stringify(rootLrc));
		const expectedPath = existsSync(savedPath);

		expect(expectedPath).toBe(true);
	});
});
