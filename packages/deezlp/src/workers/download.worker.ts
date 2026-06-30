import type { DeezerCore } from 'deezer';
import type { Settings } from '@/interfaces';
import type { AudioStreamerService, FileService } from '@/services';
import type { DownloadPayload } from '@/entities';
import { DeezerTrackUrlResolver } from '@/resolvers';
import { StrategyNotFoundException } from '@/exceptions';
import { TrackDownloadStrategy, type DownloadStrategy, type ProgressCallback } from '@/strategies';

export class DownloadWorker {
	constructor(
		private dz: DeezerCore,
		private settings: Settings,
		private fileService: FileService,
		private audioStreamerService: AudioStreamerService,
	) {}

	public start(payload: DownloadPayload, onProgress: ProgressCallback): Promise<void> {
		let strategy: DownloadStrategy<DownloadPayload>;

		switch (payload.type) {
			case 'track':
				strategy = new TrackDownloadStrategy(this.fileService, new DeezerTrackUrlResolver(this.dz), this.audioStreamerService);
				break;

			default:
				throw new StrategyNotFoundException(`No strategy found for payload type: ${payload.type}`);
		}

		return strategy.execute(payload, onProgress);
	}
}
