import type { EnrichedDeezerTrack, TrackDataFetched } from '@/interfaces';

export const enrichMissingTrackFields = (track: EnrichedDeezerTrack, data: Omit<TrackDataFetched, 'gwTrack'>): EnrichedDeezerTrack => {
	const { deezerTrack, gwTrackPage, gwLyrics } = data;

	// Get cover
	let cover: string;
	if (track?.album?.cover_small) {
		cover = track.album.cover_small;
	} else {
		cover = `https://e-cdns-images.dzcdn.net/images/cover/${track.md5_image}/75x75-000000-80-0-0.jpg`;
	}

	track.cover = cover;

	return track;
};
