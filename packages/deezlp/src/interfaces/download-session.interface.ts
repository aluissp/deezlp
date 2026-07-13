import type { DownloadJob, DownloadPayload } from '@/entities';

export interface DownloadSession {
	jobs: DownloadJob<DownloadPayload>[];
	cancelAll: () => void;
	cancelJob: (jobId: string) => void;

	/** Start the download files by session */
	start: () => Promise<void>;
	/** Listen to download events */
	on(event: 'job:status', callback: (job: DownloadJob<DownloadPayload>) => void): DownloadSession;
}
