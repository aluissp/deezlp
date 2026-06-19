import { mapGwTrackToDeezer } from '@/utils';
import { DeezerCore, type GWTrack } from 'deezer';

describe('Testing the generateTrackItem function', () => {
	let track: GWTrack;

	beforeAll(async () => {
		const deezer = new DeezerCore();
		track = await deezer.gw.getTrack(105920318); // Gorriones
		// track = await deezer.gw.getTrack(1380101222); // Life goes on
	});

	test('Should map a gw track to enriched deezer track', () => {
		expect(track).toBeDefined();

		const enrichedTrack = mapGwTrackToDeezer(track);
		expect(enrichedTrack).toBeDefined();
	});
});
