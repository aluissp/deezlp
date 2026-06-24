import { EventEmitter } from 'events';
import { TRACK_FORMATS, type DeezerCore } from 'deezer';
import { getStrategy } from '@/strategies';
import { DownloadWorker } from '@/workers';
import { resolveDeezerUrl } from '@/resolvers';
import type { Settings } from '@/interfaces';
import { createDownloadJob, type DownloadJob, DownloadJobStatus, type DownloadPayload } from '@/entities';

export class DownloadPipeline extends EventEmitter {
	private bitrate: number;
	private globalController = new AbortController();
	private activeJobs = new Map<string, AbortController>();
	public jobs: DownloadJob<DownloadPayload>[] = [];

	constructor(
		private dz: DeezerCore,
		private settings: Settings,
	) {
		super();
		this.bitrate = this.settings.maxBitrate ?? TRACK_FORMATS.MP3_128;
	}

	/**
	 * Prepare download jobs for the given urls
	 * @param urls URLs to prepare download jobs for
	 * @returns {DownloadJob[]} Array of prepared download jobs
	 */
	prepare(urls: string | string[]): DownloadJob<DownloadPayload>[] {
		if (typeof urls === 'string') urls = [urls];

		this.jobs = urls.map(url => createDownloadJob<DownloadPayload>(url));

		for (const job of this.jobs) this.activeJobs.set(job.id, new AbortController());

		return this.jobs;
	}

	/**
	 * Start download urls
	 */
	async start(): Promise<void> {
		for (const job of this.jobs) {
			if (this.globalController.signal.aborted) break;

			const jobController = this.activeJobs.get(job.id)!;

			const combinedSignal = AbortSignal.any([this.globalController.signal, jobController.signal]);

			if (combinedSignal.aborted) {
				this.updateJob(job, DownloadJobStatus.canceled);
				this.emit(DownloadJobStatus.canceled, job);
				this.activeJobs.delete(job.id);
				continue;
			}

			this.emit(DownloadJobStatus.started, job);

			try {
				// 1. Resolve the URL
				this.updateJob(job, DownloadJobStatus.resolving);
				const resolvedUrl = resolveDeezerUrl(job.url);

				// 2. Get strategy
				const strategy = getStrategy(resolvedUrl.type);

				// 3. Execute strategy
				this.updateJob(job, DownloadJobStatus.fetching);
				const items = await strategy.process(resolvedUrl, this.dz, { bitrate: this.bitrate });

				this.updateJob(job, DownloadJobStatus.downloading);
				job.payload = items;

				// 4. Start download with worker
				const downloaderWorker = new DownloadWorker(this.settings.downloadLocation);
				await downloaderWorker.start(job.payload, progressValue => {
					job.progress = progressValue;

					this.updateJob(job, DownloadJobStatus.downloading);
					this.emit(DownloadJobStatus.downloading, job);
				});
			} catch (error) {
				job.error = error;
				this.updateJob(job, DownloadJobStatus.error);
				this.emit(DownloadJobStatus.error, job);
				continue;
			}
		}
	}

	cancelAll() {
		this.globalController.abort();
		for (const controller of this.activeJobs.values()) controller.abort();
	}

	cancelJob(jobId: string) {
		const controller = this.activeJobs.get(jobId);
		if (controller) controller.abort();
	}

	private updateJob(job: DownloadJob, status: DownloadJobStatus) {
		job.status = status;
		job.updatedAt = Date.now();
	}
}
