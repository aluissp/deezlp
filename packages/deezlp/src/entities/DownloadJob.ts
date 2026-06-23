export type DownloadJobStatus = 'queued' | 'resolving' | 'fetching' | 'building' | 'downloading' | 'finished' | 'error' | 'canceled';

export interface DownloadJob<T = unknown> {
	id: string;
	url: string;
	status: DownloadJobStatus;
	progress: number;
	createdAt: number;
	updatedAt: number;
	attempts: number;
	payload?: T;
	error?: unknown;
}

export const createDownloadJob = <T>(url: string): DownloadJob<T> => ({
	id: crypto.randomUUID(),
	url,
	status: 'queued',
	progress: 0,
	createdAt: Date.now(),
	updatedAt: Date.now(),
	attempts: 0,
});
