export const JobStatus = 'job:status';

export type DownloadStatus =
	| 'queued'
	| 'started'
	| 'resolving'
	| 'fetching'
	| 'building'
	| 'downloading'
	| 'retrying'
	| 'finished'
	| 'error'
	| 'canceled';

export const DownloadStatus: Record<DownloadStatus, DownloadStatus> = {
	/** Download has started */
	started: 'started',
	/** Download is queued */
	queued: 'queued',
	/** Download is resolving the URL provided */
	resolving: 'resolving',
	/** Download is fetching the content (metadata). */
	fetching: 'fetching',
	/** Download is building the content (filepath, bitrate, writePath, cover, images, extension, etc.) */
	building: 'building',
	/** Download is downloading the content (.mp3, .flac files) */
	downloading: 'downloading',
	/** Download is finished */
	finished: 'finished',
	/** Download has an error */
	error: 'error',
	/** Download is being retried */
	retrying: 'retrying',
	/** Download is canceled */
	canceled: 'canceled',
};

export interface DownloadJob<T = unknown> {
	id: string;
	url: string;
	status: DownloadStatus;
	progress?: number;
	message?: string;
	startedAt: number;
	updatedAt: number;
	finishedAt: number;
	canceledAt: number;
	durationMs: number;
	attempts: number;
	payload?: T;
	error?: unknown;
}

export const createDownloadJob = <T>(url: string): DownloadJob<T> => ({
	id: crypto.randomUUID(),
	url,
	status: 'queued',
	progress: 0,
	startedAt: Date.now(),
	updatedAt: 0,
	finishedAt: 0,
	canceledAt: 0,
	durationMs: 0,
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
