import type { DeezerCore } from 'deezer';
import type { DownloadPayload } from '@/entities';
import { DeezerTrackUrlResolver } from '@/resolvers';
import { StrategyNotFoundException } from '@/exceptions';
import { TaggerService, type AudioStreamerService, type FileService } from '@/services';
import { AlbumDownloadStrategy, TrackDownloadStrategy, type DownloadStrategy, type UpdateCallback } from '@/strategies';

export class DownloadWorker {
	constructor(
		private dz: DeezerCore,
		private fileService: FileService,
		private taggerService: TaggerService,
		private audioStreamerService: AudioStreamerService,
	) {}

	public start(payload: DownloadPayload, onUpdate: UpdateCallback, signal?: AbortSignal): Promise<void> {
		let strategy: DownloadStrategy<DownloadPayload>;
		const payloadType = payload.type;

		switch (payloadType) {
			case 'track':
				strategy = new TrackDownloadStrategy(this.fileService, this.taggerService, new DeezerTrackUrlResolver(this.dz), this.audioStreamerService);
				break;
			case 'album':
				strategy = new AlbumDownloadStrategy(this.fileService, this.taggerService, new DeezerTrackUrlResolver(this.dz), this.audioStreamerService);
				break;

			default:
				throw new StrategyNotFoundException(`No strategy found for payload type: ${payloadType}`);
		}

		return strategy.execute(payload, onUpdate, signal);
	}
}
