import { DeezerCore } from 'deezer';
import type { ResolvedURL } from '@/resolvers';
import type { DeezerTrack, GWTrack } from 'deezer';
import { GenerationException, ISRCnotOnDeezer } from '@/exceptions';

export const fetchTrack = async (dz: DeezerCore, input: ResolvedURL): Promise<DeezerTrack | GWTrack> => {
	if (input.type !== 'track')
		throw new GenerationException(`https://deezer.com/track/${input.id}`, `El tipo de recurso no es una pista: ${input.type}`);

	let trackData: DeezerTrack | GWTrack | null = null;

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

	// 3. Try fetching from GW if the trackData is still null and the kind is 'id'
	if (!trackData && input.kind === 'id')
		trackData = await dz.gw.getTrack(input.id).catch((error: any) => {
			throw new GenerationException(`https://deezer.com/track/${input.id}`, error.message);
		});

	if (!trackData) throw new GenerationException(`https://deezer.com/track/${input.id}`, 'Does not found track data.');

	return trackData;
};
