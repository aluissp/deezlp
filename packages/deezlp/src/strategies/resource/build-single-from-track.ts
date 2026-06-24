import type { Single } from '@/entities';
import { GenerationException, InvalidID } from '@/exceptions';
import type { EnrichedDeezerTrack } from '@/interfaces';
import { mapGwTrackToDeezer } from '@/utils';
import type { DeezerTrack, GWTrack } from 'deezer';

/**
 * Builds a Single track item from a DeezerTrack or GWTrack object and a specified bitrate.
 */
export const buildSingleFromTrack = (rawTrack: DeezerTrack | GWTrack, bitrate: number): Single => {
	let track: EnrichedDeezerTrack | null = null;
	if ('SNG_ID' in rawTrack) {
		const mappedTrack = mapGwTrackToDeezer(rawTrack);
		track = { ...mappedTrack, user_id: 0, unseen: false, token: mappedTrack.track_token };
	} else if ('id' in rawTrack) {
		track = { ...rawTrack, user_id: 0, unseen: false, token: rawTrack.track_token };
	}

	if (!track) throw new GenerationException('https://deezer.com/track', 'Unable to build track from raw data');

	// Validate if id is a number
	if (!/^-?\d+$/.test(String(track.id))) throw new InvalidID(`https://deezer.com/track/${track.id}`);

	let cover: string;
	if (track?.album?.cover_small) {
		cover = track.album.cover_small;
	} else {
		cover = `https://e-cdns-images.dzcdn.net/images/cover/${track.md5_image}/75x75-000000-80-0-0.jpg`;
	}

	return {
		type: 'track',
		id: +track.id,
		title: track.title,
		artist: track.artist,
		cover,
		explicit: track.explicit_lyrics,
		bitrate,
		downloaded: 0,
		extrasPath: '',
		failed: 0,
		isCanceled: false,
		progress: 0,
		progressNext: 0,
		size: 0,
		// uuid: crypto.randomUUID(),
		single: track,
	};
};
