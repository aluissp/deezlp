import type { EnrichedDeezerTrack } from '@/interfaces';
import type { DownloadStrategy, ProgressCallback } from './download-strategy.interface';

export class SingleDownloadStrategy implements DownloadStrategy<EnrichedDeezerTrack> {
	constructor(private outputDir: string) {}

	public async execute(single: EnrichedDeezerTrack, onProgress: ProgressCallback): Promise<void> {}
}
