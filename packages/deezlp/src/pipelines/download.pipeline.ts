import { EventEmitter } from 'events';
import { getStrategy } from '@/strategies';
import { DownloadWorker } from '@/workers';
import type { Settings } from '@/interfaces';
import { resolveDeezerUrl } from '@/resolvers';
import { TrackAlreadyDownloaded } from '@/exceptions';
import { TRACK_FORMATS, type DeezerCore } from 'deezer';
import { AudioStreamerService, CryptoService, FileService, TaggerService } from '@/services';
import { createDownloadJob, type DownloadJob, type DownloadPayload, DownloadStatus, JobStatus } from '@/entities';

export class DownloadPipeline extends EventEmitter {
	private bitrate: number;
	private globalController = new AbortController();
	private activeJobs = new Map<string, AbortController>();
	public jobs: DownloadJob<DownloadPayload>[] = [];

	// services
	private fileService: FileService;
	private cryptoService: CryptoService;
	private taggerService: TaggerService;
	private downloaderWorker: DownloadWorker;
	private audioStreamerService: AudioStreamerService;

	constructor(
		private dz: DeezerCore,
		private settings: Settings,
	) {
		super();
		this.bitrate = this.settings.maxBitrate ?? TRACK_FORMATS.MP3_128;

		// services
		this.fileService = new FileService(this.settings);
		this.cryptoService = new CryptoService();
		this.audioStreamerService = new AudioStreamerService(this.settings, this.cryptoService);
		this.taggerService = new TaggerService(this.settings.tags);
		this.downloaderWorker = new DownloadWorker(this.dz, this.fileService, this.taggerService, this.audioStreamerService);
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
		try {
			for (const job of this.jobs) {
				const jobController = this.activeJobs.get(job.id)!;
				const combinedSignal = AbortSignal.any([this.globalController.signal, jobController.signal]);

				if (combinedSignal.aborted) {
					this.emitEvent({ job, status: DownloadStatus.canceled });
					continue;
				}

				this.emitEvent({ job, status: DownloadStatus.started });

				try {
					// 1. Resolve the URL
					this.emitEvent({ job, status: DownloadStatus.resolving });
					const resolvedUrl = resolveDeezerUrl(job.url);

					// 2. Get strategy
					const strategy = getStrategy(resolvedUrl.type);

					// 3. Execute strategy
					this.emitEvent({ job, status: DownloadStatus.fetching });
					const items = await strategy.process(resolvedUrl, this.dz, { bitrate: this.bitrate });

					job.payload = items;

					// 4. Start download with worker
					await this.downloaderWorker.start(
						job.payload,
						({ progress, attempts, status, message, downloadPath }) => {
							this.emitEvent({ job, status, progress, attempts, message, downloadPath });
						},
						combinedSignal,
					);

					this.emitEvent({ job, status: DownloadStatus.finished });
				} catch (error: any) {
					job.error = error;

					// 1. if the error is TrackAlreadyDownloaded
					if (error instanceof TrackAlreadyDownloaded) this.emitEvent({ job, status: DownloadStatus.finished, message: error.message });
				} finally {
					this.activeJobs.delete(job.id);
				}
			}
		} finally {
			this.jobs = [];
			this.activeJobs.clear();
			this.globalController = new AbortController();
		}
	}

	private emitEvent(data: { job: DownloadJob; status?: DownloadStatus; attempts?: number; progress?: number; message?: string; error?: unknown; downloadPath?: string }) {
		const { job, status, progress, attempts, message, error, downloadPath } = data;
		this.updateJob({ job, status, progress, attempts, message, error, downloadPath });

		this.emit(JobStatus, job);
	}

	cancelAll() {
		this.globalController.abort();
		for (const controller of this.activeJobs.values()) controller.abort();
	}

	cancelJob(jobId: string) {
		const controller = this.activeJobs.get(jobId);
		if (controller) controller.abort();
	}

	private updateJob(data: { job: DownloadJob; status?: DownloadStatus; attempts?: number; progress?: number; message?: string; error?: unknown; downloadPath?: string }) {
		const { job, status, attempts, progress, message, error, downloadPath } = data;

		job.updatedAt = Date.now();

		if (status) job.status = status;

		if (attempts) job.attempts = attempts;

		if (message) job.message = message;

		if (progress) job.progress = progress;

		if (error) job.error = error;

		if (downloadPath) job.downloadPath = downloadPath;

		if (status === DownloadStatus.started && !job.startedAt) {
			job.startedAt = job.updatedAt;
		}

		if (status === DownloadStatus.finished && job.startedAt) {
			job.finishedAt = job.updatedAt;
			job.durationMs = job.finishedAt - job.startedAt;
		}

		if (status === DownloadStatus.canceled && !job.canceledAt) {
			job.canceledAt = job.updatedAt;
		}
	}
}
