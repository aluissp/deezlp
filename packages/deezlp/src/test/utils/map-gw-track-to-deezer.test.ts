import { DeezerCore, type GWTrack } from 'deezer';
import { mapGwTrackToDeezer } from '@/utils';
// import { generateTrackItem } from '@/factory';

describe('Testing the generateTrackItem function', () => {
	let track: GWTrack;
	let deezer: DeezerCore;
	// const trackId = 105920318 // Gorriones
	const trackId = 1380101222; // Life goes on

	beforeAll(async () => {
		deezer = new DeezerCore();
		await deezer.loginViaArl(process.env.VITE_DEEZER_ARL_TOKEN || '');
		track = await deezer.gw.getTrack(trackId); // Life goes on
	});

	test('Should map a gw track to enriched deezer track', () => {
		expect(track).toBeDefined();

		const enrichedTrack = mapGwTrackToDeezer(track);
		expect(enrichedTrack).toBeDefined();
	});
});
