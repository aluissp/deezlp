import type { Single } from '@/entities';
import type { DownloadStrategy, ProgressCallback } from './download-strategy.interface';

export class SingleDownloadStrategy implements DownloadStrategy<Single> {
	constructor(private outputDir: string) {}

	public async execute(single: Single, onProgress: ProgressCallback): Promise<void> {}
}
