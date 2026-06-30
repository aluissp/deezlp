import type { DeezerCore } from 'deezer';
import type { AudioStreamerService, FileService } from '@/services';
import type { EnrichedDeezerTrack } from '@/interfaces';
import type { DeezerTrackUrlResolver } from '@/resolvers';
import type { DownloadStrategy, ProgressCallback } from './download-strategy.interface';

export class TrackDownloadStrategy implements DownloadStrategy<EnrichedDeezerTrack> {
	constructor(
		private fileService: FileService,
		private trackResolver: DeezerTrackUrlResolver,
		private audioStreamerService: AudioStreamerService,
	) {}

	public async execute(track: EnrichedDeezerTrack, onProgress: ProgressCallback): Promise<void> {
		// 1. Compute bitrate and urls
		await this.trackResolver.resolve(track);
		// 2. Build the final path for the track
		const { fileName, filePath, artistPath, coverPath } = this.fileService.buildTrackPath(track);
		const writePath = this.fileService.buildWritePath({ filePath, fileName, bitrate: track.bitrate! });
		const isAlreadyDownloaded = this.fileService.checkIsAlreadyDownload({ writePath });

		// 3. Cover paths and urls
		const { embeddedCoverURL, embeddedCoverPath } = this.fileService.buildCoverURLAndPath({
			md5: track.md5_image,
			type: 'cover',
			coverName: track.album?.title ?? '',
		});

		// 4. Download the cover if it doesn't exist
		await this.fileService.downloadImage(embeddedCoverURL, embeddedCoverPath);

		// 5. Save the synced lyrics if they exist
		this.fileService.saveSyncedLyrics(filePath, fileName, track.lyrics?.sync);

		// 6. Download the track
		await this.audioStreamerService.streamTrack(writePath, track);
		// Paso 4: Post-procesamiento (Desencriptar si es necesario, inyectar carátula/ID3 tags)
		//     await this.fileManager.applyMetadata(finalPath, track);
		//     console.log(`Descarga finalizada con éxito en: ${finalPath}`);
	}
}
