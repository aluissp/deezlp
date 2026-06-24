import type { DeezerCore } from 'deezer';
import type { ResolvedURL } from '@/resolvers';
import type { DownloadPayload } from '@/entities';

export interface ResourceStrategy {
	process(resolvedURL: ResolvedURL, dz: DeezerCore, setting: { bitrate: number }): Promise<DownloadPayload>;
}
