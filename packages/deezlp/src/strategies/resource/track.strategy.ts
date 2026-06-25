import { fetchTrack } from '@/fetch';
import type { DeezerCore, TRACK_FORMATS } from 'deezer';
import { type ResolvedURL } from '@/resolvers';
import type { ResourceStrategy } from './resource.strategy';
import { buildEnrichedTrackFromData } from './build-enriched-track-from-data';

export class TrackStrategy implements ResourceStrategy {
	public async process(resolvedUrl: ResolvedURL, dz: DeezerCore, setting: { bitrate: (typeof TRACK_FORMATS)[keyof typeof TRACK_FORMATS] }) {
		const data = await fetchTrack(dz, resolvedUrl, true);

		return buildEnrichedTrackFromData(data, setting.bitrate);
	}
}
