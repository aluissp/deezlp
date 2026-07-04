import { USER_AGENT_HEADER } from 'deezer';
import { pipeline } from 'stream/promises';
import type { UpdateCallback } from '@/strategies';
import type { CryptoService } from './crypto.service';
import got, { ReadError, TimeoutError, type Got } from 'got';
import { DownloadCanceled, DownloadEmpty, TrackMediaNotFound } from '@/exceptions';
import { createWriteStream, existsSync, unlinkSync } from 'fs';
import type { EnrichedDeezerTrack, Settings } from '@/interfaces';

export class AudioStreamerService {
	private api: Got;

	constructor(
		private settings: Settings,
		private cryptoService: CryptoService,
	) {
		this.api = got.extend({
			headers: { 'User-Agent': USER_AGENT_HEADER },
			https: { rejectUnauthorized: false },
			timeout: { request: 5000 },
		});
	}

	/**
	 * Descarga, descifra y guarda una pista de audio en tiempo real.
	 */
	async streamTrack(data: {
		writePath: string;
		track: EnrichedDeezerTrack;
		attempt: number;
		signal?: AbortSignal;
		onUpdate?: UpdateCallback;
	}): Promise<void> {
		const { writePath, track, signal, onUpdate } = data;

		if (signal?.aborted) throw new DownloadCanceled();

		const media = track.media;

		if (!media) throw new TrackMediaNotFound();

		const downloadURL = media.url;

		const isCryptedStream = downloadURL.includes('/mobile/') || downloadURL.includes('/media/');

		const blowfishKey = isCryptedStream ? this.cryptoService.generateBlowfishKey(track.id) : undefined;

		let chunkLength = 0;
		let complete = 0;
		let progressNext = 0;
		const itemData = { id: track.id, title: track.title, artist: track.artist.name };

		// 1. Create request
		const requestStream = this.api.stream(downloadURL, { signal });

		// 2. Manage progress and cancellation
		requestStream
			.on('response', response => {
				complete = parseInt(response.headers['content-length'] || '0', 10);
				if (complete === 0) {
					requestStream.destroy(new DownloadEmpty()); // Destroy the stream with error
				}
			})
			.on('data', (chunk: Buffer) => {
				// if (downloadObject?.isCanceled) {
				// 	requestStream.destroy(new DownloadCanceled());
				// 	return;
				// }

				chunkLength += chunk.length;
				// if (downloadObject && complete > 0) {
				// 	downloadObject.progressNext += (chunk.length / complete / downloadObject.size) * 100;
				// 	downloadObject.updateProgress(listener);
				// }
				if (complete > 0) {
					progressNext += (chunk.length / complete / media.size) * 100;
				}
			});

		// 4. Handle cancellation by user

		// 5. Ejecución del Pipeline Asíncrono
		try {
			await pipeline(requestStream, source => this.decrypter(source, isCryptedStream, blowfishKey), this.depadder, createWriteStream(writePath));
		} catch (error: any) {
			// Limpieza de archivo incompleto
			if (existsSync(writePath)) unlinkSync(writePath);

			if (error instanceof DownloadCanceled || error instanceof DownloadEmpty) throw error;

			// Errores controlados arrojados intencionalmente
			// if (error instanceof DownloadEmpty || error instanceof DownloadCanceled) {
			// 	throw error;
			// }

			// Manejo de Timeouts y Errores de Red (Reintento recursivo)
			const isNetworkError =
				error instanceof ReadError ||
				error instanceof TimeoutError ||
				['ESOCKETTIMEDOUT', 'ERR_STREAM_PREMATURE_CLOSE', 'ETIMEDOUT', 'ECONNRESET'].includes(error.code);

			if (isNetworkError) {
				// if (downloadObject && chunkLength !== 0 && complete > 0) {
				// 	// Revertir el progreso fallido
				// 	downloadObject.progressNext -= (chunkLength / complete / downloadObject.size) * 100;
				// 	downloadObject.updateProgress(listener);
				// }
				if (chunkLength !== 0 && complete > 0) {
					// Revertir el progreso fallido
					progressNext -= (chunkLength / complete / media.size) * 100;
				}

				if (data.attempt < this.settings.maxAttempts) {
					onUpdate?.({
						attempts: data.attempt + 1,
						progress: progressNext,
						status: 'retrying',
						message: `Retrying download (Attempt ${data.attempt + 1})`,
					});
					return this.streamTrack({ writePath, track, signal, attempt: data.attempt + 1, onUpdate });
				}
			}

			console.trace(error);
			throw error;
		}
	}

	/**
	 * Generador Privado: Maneja el descifrado por bloques (Blowfish).
	 */
	private async *decrypter(source: AsyncIterable<Buffer>, isCrypted: boolean, blowfishKey?: string) {
		if (!isCrypted || !blowfishKey) {
			yield* source; // Si no está encriptado, pasa el stream directo
			return;
		}

		let modifiedStream = Buffer.alloc(0);
		for await (const chunk of source) {
			modifiedStream = Buffer.concat([modifiedStream, chunk]);

			while (modifiedStream.length >= 2048 * 3) {
				// Usamos .subarray() en lugar de .slice() por eficiencia en Buffers modernos
				const decryptingChunks = modifiedStream.subarray(0, 2048 * 3);
				modifiedStream = modifiedStream.subarray(2048 * 3);

				let decryptedChunks = this.cryptoService.decryptChunk(decryptingChunks.subarray(0, 2048), blowfishKey);
				decryptedChunks = Buffer.concat([decryptedChunks, decryptingChunks.subarray(2048)]);

				yield decryptedChunks;
			}
		}

		// Flush de los bytes restantes
		if (modifiedStream.length > 0) {
			if (modifiedStream.length >= 2048) {
				let decryptedChunks = this.cryptoService.decryptChunk(modifiedStream.subarray(0, 2048), blowfishKey);
				decryptedChunks = Buffer.concat([decryptedChunks, modifiedStream.subarray(2048)]);
				yield decryptedChunks;
			} else {
				yield modifiedStream;
			}
		}
	}

	/**
	 * Generador Privado: Limpia bytes nulos iniciales si no es una cabecera MP4/M4A válida.
	 */
	private async *depadder(source: AsyncIterable<Buffer>) {
		let isStart = true;
		for await (let chunk of source) {
			if (isStart && chunk[0] === 0 && chunk.subarray(4, 8).toString() !== 'ftyp') {
				let i = 0;
				while (i < chunk.length && chunk[i] === 0) {
					i++;
				}
				chunk = chunk.subarray(i);
			}
			isStart = false;
			yield chunk;
		}
	}
}
