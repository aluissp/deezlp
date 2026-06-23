import type { DeezerCore } from 'deezer';
import type { ResourceStrategy } from './resource.strategy';
import { type ResolvedURL } from '@/resolvers';
import { fetchTrack } from '@/fetch';
import { buildSingleFromTrack } from '@/factory';

export class TrackStrategy implements ResourceStrategy {
	public async process(resolvedUrl: ResolvedURL, dz: DeezerCore, setting: { bitrate: number }) {
		const rawTrack = await fetchTrack(dz, resolvedUrl);

		return buildSingleFromTrack(rawTrack, setting.bitrate);
	}
}
