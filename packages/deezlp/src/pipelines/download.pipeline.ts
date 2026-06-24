import { TRACK_FORMATS, type DeezerCore } from 'deezer';
import { getStrategy } from '@/strategies';
import { DownloadWorker } from '@/workers';
import { resolveDeezerUrl } from '@/resolvers';
import { NotLoggedInException } from '@/exceptions';
import type { Listener, Settings } from '@/interfaces';
import { createDownloadJob, type DownloadJob, type DownloadPayload } from '@/entities';

export class DownloadPipeline {
	bitrate: number;

	constructor(
		private dz: DeezerCore,
		private settings: Settings,
		private listener: Listener,
	) {
		this.bitrate = this.settings.maxBitrate ?? TRACK_FORMATS.MP3_128;
	}

	/**
	 * Start download urls
	 */
	async start(urls: string | string[]) {
		for (const url of urls) {
			const job = createDownloadJob<DownloadPayload>(url);
			this.listener.send('download:start', { job });

			try {
				// 1. Resolve the URL
				this.updateJob(job, 'resolving');
				const resolvedUrl = resolveDeezerUrl(url);

				// 2. Get strategy
				const strategy = getStrategy(resolvedUrl.type);

				// 3. Execute strategy
				this.updateJob(job, 'fetching');
				const items = await strategy.process(resolvedUrl, this.dz, { bitrate: this.bitrate });

				this.updateJob(job, 'downloading');
				job.payload = items;

				// 4. Start download with worker
				const downloaderWorker = new DownloadWorker(this.settings.downloadLocation);
				await downloaderWorker.start(job.payload, progressValue => {
					job.progress = progressValue;

					this.listener.send('download:progress', { job });
				});
			} catch (error) {
				job.error = error;
				this.updateJob(job, 'error');
				this.listener.send('download:error', { job, error });
			}
		}
	}

	private updateJob(job: DownloadJob, status: DownloadJob['status']) {
		job.status = status;
		job.updatedAt = Date.now();
	}
}
