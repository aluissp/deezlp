import { DeezerCore } from 'deezer';
import type { ResolvedURL } from '@/resolvers';
import type { DeezerTrack, GWLyrics, GWTrack, GWTrackPage } from 'deezer';
import { GenerationException, ISRCnotOnDeezer } from '@/exceptions';
import type { TrackDataFetched } from '@/interfaces';

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

const fetchLyrics = async (dz: DeezerCore, songId: number): Promise<GWLyrics | undefined> => {
	return dz.gw.getTrackLyrics(songId).catch((error: any) => {
		throw new GenerationException(`https://deezer.com/track/${songId}`, error.message);
	});
};

export const fetchTrack = async (dz: DeezerCore, input: ResolvedURL): Promise<TrackDataFetched> => {
	if (input.type !== 'track')
		throw new GenerationException(`https://deezer.com/track/${input.id}`, `El tipo de recurso no es una pista: ${input.type}`);

	// 1. Fetch Deezer Track
	const deezerTrack = await fetchDeezerTrack(dz, input);

	// 2. Use the Deezer Track ID to fetch GW Track, GW Track Page, and Lyrics
	let songId: number = 0;
	if (input.kind === 'id') songId = parseInt(input.id);
	if (input.kind === 'isrc' && deezerTrack?.id) songId = +deezerTrack.id;

	const gwTrack = await fetchGwTrack(dz, songId);
	const gwTrackPage = await fetchGwTrackPage(dz, songId);
	const gwLyrics = await fetchLyrics(dz, songId);

	return {
		deezerTrack,
		gwTrack,
		gwTrackPage,
		gwLyrics,
	};
};
