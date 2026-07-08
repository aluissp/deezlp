import type { TRACK_FORMATS } from 'deezer';
import type { DownloadPayload } from '@/entities';
import { GenerationException, InvalidID } from '@/exceptions';
import type { EnrichedDeezerTrack, TrackDataFetched } from '@/interfaces';
import { enrichMissingTrackFields, mapGwTrackToDeezer } from '@/utils';

/**
 * Builds a Single track item from a DeezerTrack or GWTrack object and a specified bitrate.
 */
export const buildEnrichedTrackFromData = (
	{ deezerTrack, deezerFullAlbum, gwTrack, gwLyrics, gwTrackPage, gwAlbum }: TrackDataFetched,
	bitrate: (typeof TRACK_FORMATS)[keyof typeof TRACK_FORMATS],
): DownloadPayload => {
	// 1. We prefer to use the GWTrack because it contains more information than the DeezerTrack
	if (!gwTrack?.SNG_ID) throw new GenerationException('https://deezer.com/track', 'Unable to build track from raw data');

	const mappedTrack = mapGwTrackToDeezer(gwTrack);
	const track: EnrichedDeezerTrack = { ...mappedTrack, user_id: 0, unseen: false, track_token: mappedTrack.track_token };

	// 2.Validate if id is a number
	if (!/^-?\d+$/.test(String(track.id))) throw new InvalidID(`https://deezer.com/track/${track.id}`);

	track.bitrate = bitrate;

	// 3. Now we enrich the track with more information from the GWTrackPage and GWLyrics if available
	return enrichMissingTrackFields(track, { deezerTrack, deezerFullAlbum, gwTrackPage, gwLyrics, gwAlbum });
};
