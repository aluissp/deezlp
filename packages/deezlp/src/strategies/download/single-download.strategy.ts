import type { DeezerCore } from 'deezer';
import type { EnrichedDeezerTrack } from '@/interfaces';
import type { DownloadStrategy, ProgressCallback } from './download-strategy.interface';

export class TrackDownloadStrategy implements DownloadStrategy<EnrichedDeezerTrack> {
	constructor(
		private dz: DeezerCore,
		private outputDir: string,
	) {}

	public async execute(track: EnrichedDeezerTrack, onProgress: ProgressCallback): Promise<void> {
		console.log(`Iniciando descarga: ${track.title} - ${track.artist.name}`);
		// Paso 1: Resolver la URL óptima según bitrates y licencias
		// const { url, formatNumber } = await this.resolveStreamUrl(track);
		// Paso 2: Preparar la ruta del archivo final (ej: /music/Artist - Title.mp3)
		//     const finalPath = this.fileManager.buildOutputPath(this.outputDir, track, formatNumber);
		// Paso 3: Descargar el archivo manejando el stream y el progreso
		//     await this.audioStreamer.download(url, finalPath, onProgress);
		// Paso 4: Post-procesamiento (Desencriptar si es necesario, inyectar carátula/ID3 tags)
		//     await this.fileManager.applyMetadata(finalPath, track);
		//     console.log(`Descarga finalizada con éxito en: ${finalPath}`);
	}

	private async resolveStreamUrl(track: EnrichedDeezerTrack) {}
}
