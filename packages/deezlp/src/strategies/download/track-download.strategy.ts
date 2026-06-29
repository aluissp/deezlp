import type { DeezerCore } from 'deezer';
import type { FileService } from '@/services';
import type { EnrichedDeezerTrack, Settings } from '@/interfaces';
import type { DeezerTrackUrlResolver } from '@/resolvers';
import type { DownloadStrategy, ProgressCallback } from './download-strategy.interface';

export class TrackDownloadStrategy implements DownloadStrategy<EnrichedDeezerTrack> {
	constructor(
		private dz: DeezerCore,
		private fileService: FileService,
		private trackResolver: DeezerTrackUrlResolver,
	) {}

	public async execute(track: EnrichedDeezerTrack, onProgress: ProgressCallback): Promise<void> {
		// 1. Compute bitrate and urls
		await this.trackResolver.resolve(track);
		// 2. Build the final path for the track
		const { fileName, filePath, artistPath, coverPath } = this.fileService.buildTrackPath(track);
		const writePath = this.fileService.buildWritePath({ filePath, fileName, bitrate: track.bitrate! });
		const isAlreadyDownloaded = this.fileService.checkIsAlreadyDownload({ writePath });

		// 3. Cover urls
		// let embeddedImageFormat = `jpg-${this.settings.jpegImageQuality}`;
		// if (this.settings.embeddedArtworkPNG) embeddedImageFormat = 'png';

		// Paso 3: Descargar el archivo manejando el stream y el progreso
		//     await this.audioStreamer.download(url, finalPath, onProgress);
		// Paso 4: Post-procesamiento (Desencriptar si es necesario, inyectar carátula/ID3 tags)
		//     await this.fileManager.applyMetadata(finalPath, track);
		//     console.log(`Descarga finalizada con éxito en: ${finalPath}`);
	}
}
