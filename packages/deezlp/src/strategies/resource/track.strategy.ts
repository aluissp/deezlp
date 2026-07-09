import { fetchTrack } from '@/fetch';
import { type ResolvedURL } from '@/resolvers';
import type { DeezerCore, TRACK_FORMATS } from 'deezer';
import type { EnrichedDeezerTrack } from '@/interfaces';
import type { ResourceStrategy } from './resource.strategy';
import { buildEnrichedTrackFromData } from './build-enriched-track-from-data';

export class TrackStrategy implements ResourceStrategy {
	public async process(
		resolvedUrl: ResolvedURL,
		dz: DeezerCore,
		setting: { bitrate: (typeof TRACK_FORMATS)[keyof typeof TRACK_FORMATS] },
	): Promise<EnrichedDeezerTrack> {
		const data = await fetchTrack(dz, resolvedUrl, { includeAlbumInfo: true, includeArtistInfo: true });

		return buildEnrichedTrackFromData(data, setting.bitrate);
	}
}
