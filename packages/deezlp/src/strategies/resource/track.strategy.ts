import { fetchTrack } from '@/fetch';
import type { DeezerCore } from 'deezer';
import { type ResolvedURL } from '@/resolvers';
import type { ResourceStrategy } from './resource.strategy';
import { buildEnrichedTrackFromData } from './build-enriched-track-from-data';

export class TrackStrategy implements ResourceStrategy {
	public async process(resolvedUrl: ResolvedURL, dz: DeezerCore, setting: { bitrate: number }) {
		const data = await fetchTrack(dz, resolvedUrl);

		return buildEnrichedTrackFromData(data, setting.bitrate);
	}
}
