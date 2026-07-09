export const JobStatus = 'job:status';

export type DownloadStatus =
	| 'queued'
	| 'started'
	| 'resolving'
	| 'fetching'
	| 'building'
	| 'downloading'
	| 'tagging'
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
	/** Tagging is downloading the content (.mp3, .flac files) */
	tagging: 'tagging',
	/** Download and tagging is finished */
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
	downloadPath?: string;
	startedAt: number;
	updatedAt: number;
	finishedAt: number;
	canceledAt: number;
	durationMs: number;
	attempts: number;
	payload?: T;
	error?: unknown;
}

/**
 * If download job is only for one track the values:
 * - `progress`: 0-100 represents the progress of the download of the track.
 * - `attempts`: represents the number of attempts to download the track.
 *
 * If download job is for an album the values:
 * - `progress`: 1 - n where (n is the total number of tracks downloaded).
 * - `attempts`: represents the number of attempts to download the entire album.
 */
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
