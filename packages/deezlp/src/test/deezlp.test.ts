import { Deezlp } from '@/deezlp';
import { DEFAULT_SETTINGS } from '@/constants';

describe('Testing the generateTrackItem function', () => {
	let deezlp: Deezlp;
	// const trackId = 105920318 // Gorriones
	const trackId = 1380101222; // Life goes on
	const isrcTrackId = 'USAT22007153'; // Life goes on
	const links = [
		'https://www.deezer.com/mx/track/99976952?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-99976952&deferredFl=1&universal_link=1',
		'https://www.deezer.com/mx/track/562774642?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-562774642&deferredFl=1&universal_link=1',
	];

	beforeAll(async () => {
		deezlp = new Deezlp({
			...DEFAULT_SETTINGS,
			maxBitrate: 3,
			downloadLocation: '/home/luis/Música/deemix Music',
			syncedLyrics: true,
		});
		await deezlp.loginViaArl(process.env.VITE_DEEZER_ARL_TOKEN || '');
	});

	test('Should download deezer tracks', async () => {
		const result = deezlp.download(links);
		await result.done;
		// expect().toBeDefined();
	});

	// test('Should generate a single track item with number ID', async () => {
	// 	expect(track).toBeDefined();

	// 	const enrichedTrack = await generateTrackItem(deezer, trackId, 3);
	// 	expect(enrichedTrack).toBeDefined();
	// });

	// test('Should generate a single track item with ISRC ID', async () => {
	// 	expect(track).toBeDefined();

	// 	const enrichedTrack = await generateTrackItem(deezer, isrcTrackId, 3);
	// 	expect(enrichedTrack).toBeDefined();
	// });
});
