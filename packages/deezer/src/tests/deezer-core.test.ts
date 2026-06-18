import { DeezerCore } from '@/deezer-core';
import exampleTrack from './deezer-track.example.json';

const deezer = new DeezerCore();
const token = process.env.VITE_DEEZER_ARL_TOKEN;

describe('Testing DeezerCore class', () => {
	test('Should login via ARL', async () => {
		expect(token).toBeDefined();

		const result = await deezer.loginViaArl(token!);

		expect(result).toBe(true);
		expect(deezer.loggedIn).toBe(true);
	});

	test('Should find track by ID and must be equal a example json object | DeezerApi', async () => {
		// const track = await deezer.api.getTrack(1380101222); // Life goes on
		// const track = await deezer.api.getTrack(1908153427); // Sueno o pesadilla
		const track = await deezer.api.getTrack(exampleTrack.id); // Gorriones

		expect(track).toBeDefined();
		expect(track.id).toBe(exampleTrack.id);
		expect(track.title).toBe(exampleTrack.title);
		expect(track.title_short).toBe(exampleTrack.title_short);
		expect(track.title_version).toBe(exampleTrack.title_version);
		expect(track.release_date).toBe(exampleTrack.release_date);
		expect(track.share).toBeTypeOf('string');
		expect(track.preview).toBeTypeOf('string');
		expect(track.duration).toBe(exampleTrack.duration);
		expect(track.rank).toBe(exampleTrack.rank);
		expect(track.explicit_lyrics).toBe(exampleTrack.explicit_lyrics);
	});

	test('Should find track by ID and must be equal a example json object | DeezerGW', async () => {
		const track = await deezer.gw.getTrack(exampleTrack.id); // Gorriones

		expect(track).toBeDefined();
		expect(track.SNG_ID).toBe(String(exampleTrack.id));
		expect(track.SNG_TITLE).toBe(exampleTrack.title);
		expect(track.PHYSICAL_RELEASE_DATE).toBe(exampleTrack.release_date);
		expect(track.DURATION).toBe(String(exampleTrack.duration));
		expect(track.RANK).toBe(String(exampleTrack.rank));
		expect(track.EXPLICIT_LYRICS).toBe(String(exampleTrack.explicit_lyrics ? 1 : 0));
	});
});
