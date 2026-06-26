import type { DeezerCore } from 'deezer';
import type { DownloadPayload } from '@/entities';
import { StrategyNotFoundException } from '@/exceptions';
import { TrackDownloadStrategy, type DownloadStrategy, type ProgressCallback } from '@/strategies';
import { DeezerTrackUrlResolver } from '@/resolvers';

export class DownloadWorker {
	constructor(
		private dz: DeezerCore,
		private outputDir: string,
	) {}

	public start(payload: DownloadPayload, onProgress: ProgressCallback): Promise<void> {
		let strategy: DownloadStrategy<DownloadPayload>;

		switch (payload.type) {
			case 'track':
				strategy = new TrackDownloadStrategy(this.dz, this.outputDir, new DeezerTrackUrlResolver(this.dz));
				break;

			default:
				throw new StrategyNotFoundException(`No strategy found for payload type: ${payload.type}`);
		}

		return strategy.execute(payload, onProgress);
	}
}
