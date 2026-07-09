import { DeezerCore } from 'deezer';
import type { ResolvedURL } from '@/resolvers';
import { GenerationException } from '@/exceptions';
import type { TrackDataFetched } from '@/interfaces';
import type { DeezerArtist, DeezerFullAlbum, DeezerTrack, GwAlbum, GWLyrics, GWTrack, GWTrackPage } from 'deezer';

const fetchDeezerTrack = async (dz: DeezerCore, songId: number): Promise<DeezerTrack | undefined> => {
	return dz.api.getTrack(songId).catch((error: any) => {
		throw new GenerationException(`https://deezer.com/track/${songId}`, error.message);
	});
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
 * Fetches album data from Deezer and GW (if available) based on the provided ResolvedURL.
 * @param dz DeezerCore instance to interact with Deezer API.
 * @param input ResolvedURL object containing the album ID.
 * @param options Options for fetching additional information.
 * @returns A Promise that resolves to a TrackDataFetched object containing the fetched album data.
 */
export const fetchAlbum = async (dz: DeezerCore, input: ResolvedURL, options: Options): Promise<TrackDataFetched[]> => {
	if (input.type !== 'album')
		throw new GenerationException(`https://deezer.com/album/${input.id}`, `El tipo de recurso no es un álbum: ${input.type}`);

	const { includeAlbumInfo = false, includeArtistInfo = false } = options;

	const trackList = await dz.api
		.getAlbumTrackList(input.id)
		.then(response => response.data)
		.catch(() => []);

	const promises = trackList.map(async track => {
		const songId: number = track.id;

		// 1. Fetch Deezer Track
		const [deezerTrack, gwTrack, gwTrackPage, gwLyrics] = await Promise.all([
			fetchDeezerTrack(dz, songId),
			fetchGwTrack(dz, songId),
			fetchGwTrackPage(dz, songId),
			fetchLyrics(dz, songId),
		]).catch(() => [undefined, undefined, undefined, undefined]);

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
	});

	return Promise.all(promises);
};
