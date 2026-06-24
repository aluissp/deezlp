import type { DownloadPayload } from '@/entities';
import { GenerationException, InvalidID } from '@/exceptions';
import type { EnrichedDeezerTrack, TrackDataFetched } from '@/interfaces';
import { enrichMissingTrackFields, mapGwTrackToDeezer } from '@/utils';

/**
 * Builds a Single track item from a DeezerTrack or GWTrack object and a specified bitrate.
 */
export const buildEnrichedTrackFromData = ({ deezerTrack, gwTrack, gwLyrics, gwTrackPage }: TrackDataFetched, bitrate: number): DownloadPayload => {
	// 1. We prefer to use the GWTrack because it contains more information than the DeezerTrack
	if (!gwTrack?.SNG_ID) throw new GenerationException('https://deezer.com/track', 'Unable to build track from raw data');

	const mappedTrack = mapGwTrackToDeezer(gwTrack);
	const track: EnrichedDeezerTrack = { ...mappedTrack, user_id: 0, unseen: false, token: mappedTrack.track_token };

	// 2.Validate if id is a number
	if (!/^-?\d+$/.test(String(track.id))) throw new InvalidID(`https://deezer.com/track/${track.id}`);

	// 3. Now we enrich the track with more information from the GWTrackPage and GWLyrics if available
	return enrichMissingTrackFields(track, { deezerTrack, gwTrackPage, gwLyrics });
};
