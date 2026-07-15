import { DownloadCanceled } from '@/exceptions';
import type { TrackExtensions } from '@/constants';
import type { AlbumDownloadPayload } from '@/entities';
import type { DeezerTrackUrlResolver } from '@/resolvers';
import type { AudioStreamerService, FileService, TaggerService } from '@/services';
import type { DownloadStrategy, UpdateCallback } from './download-strategy.interface';

export class AlbumDownloadStrategy implements DownloadStrategy<AlbumDownloadPayload> {
	constructor(
		private fileService: FileService,
		private taggerService: TaggerService,
		private trackResolver: DeezerTrackUrlResolver,
		private audioStreamerService: AudioStreamerService,
	) {}

	public async execute(album: AlbumDownloadPayload, onUpdate: UpdateCallback, signal?: AbortSignal): Promise<void> {
		if (signal?.aborted) throw new DownloadCanceled();

		const totalTracks = album.enrichedTracks.length;

		// Start downloading each track in the album
		const trackPromises = album.enrichedTracks.map(async (track, index) => {
			// Update progress
			onUpdate?.({ status: 'downloading', progress: index + 1 });

			// Progress tracking
			album.currentProgress = {
				trackIndex: index,
				progressStatus: 'fetching',
				trackAttempts: 0,
				trackProgress: 0,
				totalTracks,
			};

			// 1. Compute bitrate and urls
			await this.trackResolver.resolve(track);
			// 2. Build the final path for the track
			const { fileName, filePath, artistPath, coverPath } = this.fileService.buildTrackPath(track);
			const { writePath, extension } = this.fileService.buildWritePath({ filePath, fileName, bitrate: track.bitrate! });
			const isAlreadyDownloaded = this.fileService.checkIsAlreadyDownload({ writePath });

			// Check if the track is already downloaded
			// if (isAlreadyDownloaded) throw new TrackAlreadyDownloaded(`Track already downloaded at ${writePath}.`);
			if (isAlreadyDownloaded) {
				album.currentProgress.progressStatus = 'finished';
				album.currentProgress.trackProgress = 100;
				return;
			}

			if (signal?.aborted) throw new DownloadCanceled();

			// 3. Cover paths and urls
			const { embeddedCoverURL, embeddedCoverPath } = this.fileService.buildCoverURLAndPath({
				md5: track.md5_image,
				type: 'cover',
				coverName: track.album?.title ?? '',
			});

			track.embeddedCoverPath = embeddedCoverPath;

			// 4. Artist and album cover paths
			const { artistWritePath, coverWritePath } = this.fileService.buildArtistAlbumWritePath({
				track,
				artistPath,
				coverPath,
			});

			// 5. Download the cover if it doesn't exist
			const promises: Promise<string | undefined>[] = [];

			promises.push(this.fileService.downloadImage(embeddedCoverURL, embeddedCoverPath));

			// 6. Download the artist and album covers if they don't exist
			if (artistWritePath && track?.artist?.picture_xl) {
				promises.push(this.fileService.downloadImage(track.artist.picture_xl, artistWritePath));
			}
			if (coverWritePath && track?.album?.cover_xl) {
				promises.push(this.fileService.downloadImage(track.album.cover_xl, coverWritePath));
			}

			// 7. Wait for all downloads to complete
			await Promise.all(promises);

			if (signal?.aborted) throw new DownloadCanceled();

			// 8. Save the synced lyrics if they exist
			this.fileService.saveSyncedLyrics(filePath, fileName, track.lyrics?.sync);

			// 9. Download the track
			album.currentProgress.progressStatus = 'downloading';
			await this.audioStreamerService.streamTrack({
				writePath,
				track,
				signal,
				attempt: 0,
				onUpdate: ({ attempts, downloadPath, message, progress, status }) => {
					if (!album.currentProgress) return;
					if (attempts) album.currentProgress.trackAttempts = attempts;
					if (progress) album.currentProgress.trackProgress = progress;
					if (status) album.currentProgress.progressStatus = status;
					album.currentProgress.message = message;
					album.currentProgress.downloadPath = downloadPath;
				},
			});

			// 10. Apply metadata to the downloaded track
			onUpdate?.({ status: 'tagging', progress: index + 1 });
			album.currentProgress.progressStatus = 'tagging';
			this.taggerService.tagTrack(track, writePath, extension as TrackExtensions);

			// 11. Add to download progress history
			album.currentProgress.progressStatus = 'finished';
			album.downloadProgress.push(album.currentProgress);
		});

		// 11. Wait for all track downloads to complete
		await Promise.all(trackPromises).catch(error => {
			if (error instanceof DownloadCanceled) throw error; // only throw if the download was canceled
		});
	}
}
