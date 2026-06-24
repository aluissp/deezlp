import type { DownloadJob, DownloadJobStatus, DownloadPayload } from '@/entities';

export interface DownloadSession {
	jobs: DownloadJob<DownloadPayload>[];
	cancelAll: () => void;
	cancelJob: (jobId: string) => void;

	on(event: DownloadJobStatus, callback: (...args: any[]) => void): DownloadSession;
	done: Promise<void>;
}
