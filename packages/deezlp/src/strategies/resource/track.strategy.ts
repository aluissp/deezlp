import { fetchTrack } from '@/fetch';
import type { DeezerCore } from 'deezer';
import { type ResolvedURL } from '@/resolvers';
import type { ResourceStrategy } from './resource.strategy';
import { buildSingleFromTrack } from './build-single-from-track';

export class TrackStrategy implements ResourceStrategy {
	public async process(resolvedUrl: ResolvedURL, dz: DeezerCore, setting: { bitrate: number }) {
		const rawTrack = await fetchTrack(dz, resolvedUrl);

		return buildSingleFromTrack(rawTrack, setting.bitrate);
	}
}
