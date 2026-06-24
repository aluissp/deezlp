export type DownloadJobStatus = 'queued' | 'started' | 'resolving' | 'fetching' | 'building' | 'downloading' | 'finished' | 'error' | 'canceled';

export const DownloadJobStatus: Record<DownloadJobStatus, DownloadJobStatus> = {
	started: 'started',
	queued: 'queued',
	resolving: 'resolving',
	fetching: 'fetching',
	building: 'building',
	downloading: 'downloading',
	finished: 'finished',
	error: 'error',
	canceled: 'canceled',
};

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

// type: 'track';
// bitrate: number;
// title: string;
// artist: EnrichedDeezerArtist;
// cover: string;
// explicit: boolean;
// size: number;
// downloaded: number;
// failed: number;
// progress: number;
// errors?: any;
// files?: any;
// extrasPath: string;
// progressNext: number;
// isCanceled: boolean;
