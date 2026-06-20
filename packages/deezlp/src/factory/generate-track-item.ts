import { Single } from './Single';
import { DeezerCore, type DeezerTrack } from 'deezer';
import { GenerationException, InvalidID, ISRCnotOnDeezer } from '@/exceptions';
import { mapGwTrackToDeezer } from '@/utils';
import type { EnrichedDeezerTrack } from '@/interfaces';

/**
 * Generates a Single track item based on a Deezer track ID or ISRC code and a specified bitrate.
 *
 * @param dz DeezerCore instance
 * @param id Deezer track ID or ISRC code
 * @param bitrate Desired bitrate for the track (e.g., 128 -> 1, 320 -> 3, flac -> 9)
 * @returns {Promise<Single>} A promise that resolves to a Single track item
 */
export const generateTrackItem = async (dz: DeezerCore, id: string | number, bitrate: number): Promise<Single> => {
	let deezerTrack: EnrichedDeezerTrack;

	if (String(id).startsWith('isrc') || +id > 0) {
		deezerTrack = await dz.api
			.getTrack(id)
			.then((track: DeezerTrack) => ({
				...track,
				user_id: 0,
				unseen: false,
				token: track.track_token,
			}))
			.catch((error: any) => {
				throw new GenerationException(`https://deezer.com/track/${id}`, error.message);
			});

		// Check if the id is an ISRC and if the track was found
		if (String(id).startsWith('isrc')) {
			if (deezerTrack.id && deezerTrack.title) id = deezerTrack.id;
			else throw new ISRCnotOnDeezer(`https://deezer.com/track/${id}`);
		}
	} else if (isNaN(+id)) {
		deezerTrack = await dz.api
			.getTrackByISRC(String(id))
			.then((track: DeezerTrack) => ({
				...track,
				user_id: 0,
				unseen: false,
				token: track.track_token,
			}))
			.catch((error: any) => {
				throw new GenerationException(`https://deezer.com/track/${id}`, error.message);
			});

		if (deezerTrack.id && deezerTrack.title) id = deezerTrack.id;
		else throw new ISRCnotOnDeezer(`https://deezer.com/track/${id}`);
	} else {
		const gwTrack = await dz.gw.getTrack(id).catch((error: any) => {
			throw new GenerationException(`https://deezer.com/track/${id}`, error.message);
		});
		deezerTrack = mapGwTrackToDeezer(gwTrack);
	}

	// Validate if id is a number
	if (!/^-?\d+$/.test(String(id))) throw new InvalidID(`https://deezer.com/track/${id}`);

	let cover: string;
	if (deezerTrack?.album?.cover_small) {
		cover = deezerTrack.album.cover_small;
	} else {
		cover = `https://e-cdns-images.dzcdn.net/images/cover/${deezerTrack.md5_image}/75x75-000000-80-0-0.jpg`;
	}

	return new Single({
		id,
		type: 'track',
		bitrate,
		title: deezerTrack.title,
		artist: deezerTrack.artist.name,
		cover,
		explicit: deezerTrack.explicit_lyrics,
		single: deezerTrack, // {trackApi, albumApi}
	});
};
