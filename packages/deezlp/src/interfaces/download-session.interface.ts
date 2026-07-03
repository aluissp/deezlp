import type { DownloadJob, DownloadPayload, JobStatus } from '@/entities';
export interface DownloadSession {
	jobs: DownloadJob<DownloadPayload>[];
	cancelAll: () => void;
	cancelJob: (jobId: string) => void;

	on(event: typeof JobStatus, callback: (...args: any[]) => void): DownloadSession;
	done: Promise<void>;
}
