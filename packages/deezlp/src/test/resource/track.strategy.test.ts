import { fetchTrack } from '@/fetch';
import type { ResolvedURL } from '@/resolvers';
import { DeezerCore, TRACK_FORMATS } from 'deezer';
import { buildEnrichedTrackFromData } from '@/strategies';
import { beforeAll, describe, expect, test } from 'bun:test';

describe('Testing the TrackStrategy class components', () => {
	let dz: DeezerCore;
	let token: string = process.env.VITE_DEEZER_ARL_TOKEN || '';

	const trackResolved1: ResolvedURL = { id: '105920318', kind: 'id', type: 'track' }; // Gorriones
	const trackResolved2: ResolvedURL = { id: '1380101222', kind: 'id', type: 'track' }; // Life goes on
	const trackResolved3: ResolvedURL = { id: '99976952', kind: 'id', type: 'track' }; // Stressed Out
	const trackResolved4: ResolvedURL = { id: '562774642', kind: 'id', type: 'track' }; // Jumpsuit
	const trackResolved5: ResolvedURL = { id: '116914026', kind: 'id', type: 'track' }; // Money
	const trackResolved6: ResolvedURL = { id: '644607952', kind: 'id', type: 'track' }; // El efecto
	const trackResolved7: ResolvedURL = { id: '135105006', kind: 'id', type: 'track' }; // Es un secreto

	beforeAll(async () => {
		dz = new DeezerCore();

		await dz.loginViaArl(token);
	});

	test('Should fetch all track data `fetchTrack`', async () => {
		// You must `can_stream_hq` or `can_stream_lossless`
		if (!dz.currentUser.can_stream_hq || !dz.currentUser.can_stream_lossless) return;

		const allTracks = await Promise.all([
			fetchTrack(dz, trackResolved1, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved2, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved3, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved4, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved5, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved6, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved7, { includeAlbumInfo: true, includeArtistInfo: true }),
		]);

		allTracks.forEach(track => {
			expect(track).toBeDefined();

			Object.values(track).forEach(value => {
				expect(value).toBeDefined();
			});
		});
	}, 10000);

	test('Should build all track data `buildEnrichedTrackFromData`', async () => {
		// You must `can_stream_hq` or `can_stream_lossless`
		if (!dz.currentUser.can_stream_hq || !dz.currentUser.can_stream_lossless) return;

		const allTracks = await Promise.all([
			fetchTrack(dz, trackResolved1, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved2, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved3, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved4, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved5, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved6, { includeAlbumInfo: true, includeArtistInfo: true }),
			fetchTrack(dz, trackResolved7, { includeAlbumInfo: true, includeArtistInfo: true }),
		]);

		allTracks.forEach(rawTrack => {
			expect(rawTrack).toBeDefined();
			const track320 = buildEnrichedTrackFromData(rawTrack, TRACK_FORMATS.MP3_320);
			expect(track320).toBeDefined();
			expect(track320?.gwLyrics).toBeDefined();
			expect(track320?.album).toBeDefined();
			expect(track320?.artist).toBeDefined();
			expect(track320?.contributors).toBeDefined();
			expect(track320?.song_collaborators).toBeDefined();
			expect(track320?.song_contributors).toBeDefined();
			expect(track320?.bitrate).toBeDefined();

			const trackFLAC = buildEnrichedTrackFromData(rawTrack, TRACK_FORMATS.FLAC);
			expect(trackFLAC).toBeDefined();
			expect(trackFLAC?.gwLyrics).toBeDefined();
			expect(trackFLAC?.album).toBeDefined();
			expect(trackFLAC?.artist).toBeDefined();
			expect(trackFLAC?.contributors).toBeDefined();
			expect(trackFLAC?.song_collaborators).toBeDefined();
			expect(trackFLAC?.song_contributors).toBeDefined();
			expect(trackFLAC?.bitrate).toBeDefined();
		});
	}, 10000);
});
