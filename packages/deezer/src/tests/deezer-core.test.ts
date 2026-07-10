import { DeezerCore } from '@/deezer-core';
import exampleTrack from './deezer-track.example.json';
import { beforeAll, describe, expect, test } from 'bun:test';
import { TRACK_FORMAT_NAMES, TRACK_FORMATS } from '@/constants';

describe('Testing DeezerCore class', () => {
	let deezer: DeezerCore;
	let token: string | undefined;

	beforeAll(async () => {
		deezer = new DeezerCore();
		token = process.env.VITE_DEEZER_ARL_TOKEN;
	});

	test('Should login via ARL', async () => {
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

	test('Should find track by ISRC and must be equal a example json object | DeezerApi', async () => {
		const track = await deezer.api.getTrackByISRC(exampleTrack.isrc); // Gorriones

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

	test('Should find track page | DeezerGW', async () => {
		const track = await deezer.gw.getTrackPage(1380101222); // Life goes on

		expect(track).toBeDefined();
		expect(track.DATA.SNG_ID).toBe(String(1380101222));
		expect(track.DATA.SNG_TITLE).toBe('Life Goes On');
		expect(track.DATA.PHYSICAL_RELEASE_DATE).toBe('2021-05-28');
		expect(track.DATA.DURATION).toBe(String(161));
		expect(track.LYRICS.LYRICS_ID).toBe('54389432');
	});

	test('Should find track lyrics | DeezerGW', async () => {
		const lyrics = await deezer.gw.getTrackLyrics(1380101222); // Life goes on

		expect(lyrics).toBeDefined();
		expect(lyrics.LYRICS_ID).toBe('54389432');
		expect(lyrics.LYRICS_COPYRIGHTS).toBe('Kobalt Music Publishing Ltd., Universal Music Publishing Group, Warner Chappell Music, Inc.');
		expect(lyrics.LYRICS_TEXT).toBeDefined();
		expect(lyrics.LYRICS_WRITERS).toBe('Oliver Tree Nickell, Tanner Petula');
	});

	test('Should find album by id | DeezerGW', async () => {
		const album = await deezer.gw.getAlbum('231948702'); // Oliver tree album

		expect(album).toBeDefined();
		expect(album.ART_ID).toBe('10799102');
		expect(album.ART_NAME).toBe('Oliver Tree');
		expect(album.DIGITAL_RELEASE_DATE).toBe('2021-05-28');
	});

	test('Should find album by id | DeezerApi', async () => {
		const artist = await deezer.api.getArtist('10799102'); // Oliver tree

		expect(artist).toBeDefined();
		expect(artist).toHaveProperty('id');
		expect(artist).toHaveProperty('name');
		expect(artist).toHaveProperty('link');
		expect(artist).toHaveProperty('share');
		expect(artist).toHaveProperty('picture');
	});

	test('Should find track urls by tokens | DeezerMedia', async () => {
		// Please run the first test loginViaArl!
		if (!deezer.loggedIn) return;

		const track1 = await deezer.gw.getTrack(exampleTrack.id); // Gorriones
		const track2 = await deezer.gw.getTrack(776837); // Nosebleed

		const format128 = TRACK_FORMAT_NAMES[TRACK_FORMATS.MP3_128];
		const format320 = TRACK_FORMAT_NAMES[TRACK_FORMATS.MP3_320];
		const formatFLAC = TRACK_FORMAT_NAMES[TRACK_FORMATS.FLAC];

		const trackTokens = [track1.TRACK_TOKEN, track2.TRACK_TOKEN];

		const [urls128, urls320, urlsFLAC] = await Promise.all([
			deezer.getTracksByUrls(trackTokens, format128),
			deezer.getTracksByUrls(trackTokens, format320),
			deezer.getTracksByUrls(trackTokens, formatFLAC),
		]);

		expect(urls128?.[0]?.media?.[0]?.sources?.[0]?.url).toBeDefined();
		expect(urls320?.[0]?.media?.[0]?.sources?.[0]?.url).toBeDefined();
		expect(urlsFLAC?.[0]?.media?.[0]?.sources?.[0]?.url).toBeDefined();
	});

	test('Should find full album data | DeezerApi', async () => {
		// Please run the first test loginViaArl!
		if (!deezer.loggedIn) return;

		const album1 = await deezer.api.getFullAlbum(231948702); // Oliver Tree album

		expect(album1).toBeDefined();
		expect(album1.available).toBe(true);
		expect(album1.explicit_lyrics).toBe(true);
		expect(album1.genres.data?.[0]?.id).toBe(85);
		expect(album1.genres.data?.[0]?.name).toBe('Alternativo');
		expect(album1.nb_tracks).toBe(21);
		expect(album1.tracks.data.length).toBe(album1.nb_tracks);
	});

	test('Should find album track list | DeezerApi', async () => {
		// Please run the first test loginViaArl!
		if (!deezer.loggedIn) return;

		const album1 = await deezer.api.getAlbumTrackList(231948702); // Oliver Tree album

		expect(album1).toBeDefined();
		expect(album1.data.length).toBe(21);
		expect(album1.data.length).toBe(album1.total);
	});
});
