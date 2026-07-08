import { DeezerCore } from 'deezer';
import { fetchTrack } from '@/fetch';
import type { ResolvedURL } from '@/resolvers';

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
});
