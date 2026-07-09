import { DeezerCore } from 'deezer';
import type { ResolvedURL } from '@/resolvers';
import type { TrackDataFetched } from '@/interfaces';
import type { DeezerArtist, DeezerFullAlbum, DeezerTrack, GwAlbum, GWLyrics, GWTrack, GWTrackPage } from 'deezer';
import { GenerationException, ISRCnotOnDeezer } from '@/exceptions';

const fetchDeezerTrack = async (dz: DeezerCore, input: ResolvedURL): Promise<DeezerTrack | undefined> => {
	let trackData: DeezerTrack | undefined = undefined;

	// 1. Fetch by id
	if (input.kind === 'id')
		trackData = await dz.api.getTrack(input.id).catch((error: any) => {
			throw new GenerationException(`https://deezer.com/track/${input.id}`, error.message);
		});

	// 2. Fetch by ISRC
	if (input.kind === 'isrc') {
		trackData = await dz.api.getTrackByISRC(input.id).catch((error: any) => {
			throw new GenerationException(`https://deezer.com/track/${input.id}`, error.message);
		});

		if (!trackData?.id || !trackData?.title) throw new ISRCnotOnDeezer(`https://deezer.com/track/${input.id}`);
	}

	return trackData;
};

const fetchGwTrack = async (dz: DeezerCore, songId: number): Promise<GWTrack | undefined> => {
	return dz.gw.getTrack(songId).catch((error: any) => {
		throw new GenerationException(`https://deezer.com/track/${songId}`, error.message);
	});
};

const fetchGwTrackPage = async (dz: DeezerCore, songId: number): Promise<GWTrackPage | undefined> => {
	return dz.gw.getTrackPage(songId).catch((error: any) => {
		throw new GenerationException(`https://deezer.com/track/${songId}`, error.message);
	});
};

const fetchLyrics = async (dz: DeezerCore, songId: number): Promise<GWLyrics> => {
	return dz.gw.getTrackLyrics(songId).catch((error: any) => {
		throw new GenerationException(`https://deezer.com/track/${songId}`, error.message);
	});
};

const fetchGwAlbum = async (dz: DeezerCore, albumId: string | number): Promise<GwAlbum | undefined> => {
	return dz.gw.getAlbum(albumId).catch((error: any) => {
		throw new GenerationException(`https://deezer.com/album/${albumId}`, error.message);
	});
};

const fetchDeezerArtist = async (dz: DeezerCore, artistId: string | number): Promise<DeezerArtist | undefined> => {
	return dz.api.getArtist(artistId).catch((error: any) => {
		throw new GenerationException(`https://deezer.com/artist/${artistId}`, error.message);
	});
};

const fetchDeezerFullAlbum = async (dz: DeezerCore, albumId: string | number): Promise<DeezerFullAlbum | undefined> => {
	return dz.api.getFullAlbum(albumId).catch((error: any) => {
		throw new GenerationException(`https://deezer.com/album/${albumId}`, error.message);
	});
};

interface Options {
	/** If true, fetch deezer full album data and gw album data */
	includeAlbumInfo?: boolean;
	/** If true, fetch deezer artist data */
	includeArtistInfo?: boolean;
}

/**
 * Fetches track data from Deezer and GW (if available) based on the provided ResolvedURL.
 * @param dz DeezerCore instance to interact with Deezer API.
 * @param input ResolvedURL object containing the track ID or ISRC and its type.
 * @param options Options for fetching additional information.
 * @returns A Promise that resolves to a TrackDataFetched object containing the fetched track data.
 */
export const fetchTrack = async (dz: DeezerCore, input: ResolvedURL, options: Options): Promise<TrackDataFetched> => {
	if (input.type !== 'track')
		throw new GenerationException(`https://deezer.com/track/${input.id}`, `El tipo de recurso no es una pista: ${input.type}`);

	const { includeAlbumInfo = false, includeArtistInfo = false } = options;

	// 1. Fetch Deezer Track
	const deezerTrack = await fetchDeezerTrack(dz, input);

	// 2. Use the Deezer Track ID to fetch GW Track, GW Track Page, and Lyrics
	let songId: number = 0;
	if (input.kind === 'id') songId = parseInt(input.id);
	if (input.kind === 'isrc' && deezerTrack?.id) songId = +deezerTrack.id;

	const gwTrack = await fetchGwTrack(dz, songId);
	const gwTrackPage = await fetchGwTrackPage(dz, songId);
	const gwLyrics = await fetchLyrics(dz, songId);

	// Album
	const albumId = gwTrack?.ALB_ID || deezerTrack?.album?.id;

	/** Gw album data */
	let gwAlbum: GwAlbum | undefined = undefined;
	if (includeAlbumInfo && albumId) gwAlbum = await fetchGwAlbum(dz, albumId);

	/** Deezer full album data */
	let deezerFullAlbum: DeezerFullAlbum | undefined;
	if (includeAlbumInfo && albumId) deezerFullAlbum = await fetchDeezerFullAlbum(dz, albumId);

	// Artist
	const artistId = gwTrack?.ART_ID || deezerTrack?.artist?.id;

	let deezerArtist: DeezerArtist | undefined = undefined;
	if (includeArtistInfo && artistId) deezerArtist = await fetchDeezerArtist(dz, artistId);

	return {
		deezerTrack,
		deezerArtist,
		deezerFullAlbum,
		gwTrack,
		gwTrackPage,
		gwLyrics,
		gwAlbum,
	};
};
