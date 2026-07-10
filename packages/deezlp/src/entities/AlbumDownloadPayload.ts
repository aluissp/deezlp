import type { EnrichedDeezerTrack } from '@/interfaces';
import type { DownloadStatus } from './DownloadJob';

type DownloadProgress = {
	trackIndex: number;
	trackProgress: number;
	trackAttempts: number;
	progressStatus: DownloadStatus;
	totalTracks: number;
};

/**
 * Payload for an album download job.
 *
 * - `currentProgress`: The current progress of the album download job.
 * - `downloadProgress`: An array of download progress for each track in the album.
 * - `enrichedTracks`: An array of enriched Deezer tracks for the album.
 */
export interface AlbumDownloadPayload {
	currentProgress?: DownloadProgress;
	downloadProgress: DownloadProgress[];
	enrichedTracks: EnrichedDeezerTrack[];
}
