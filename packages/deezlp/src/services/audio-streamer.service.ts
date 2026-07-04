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
	 * Streams a track from Deezer, handling decryption and padding if necessary.
	 * @param data The data required to stream the track
	 * @returns
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

		/** Complete file size */
		let complete = 0;
		let chunkLength = 0;
		let progressNext = 0;

		// 1. Create request
		const requestStream = this.api.stream(downloadURL, { signal });

		// 2. Manage progress and cancellation
		requestStream
			.on('response', response => {
				complete = parseInt(response.headers['content-length'] || '0', 10);

				// Destroy the stream with error
				if (complete === 0) requestStream.destroy(new DownloadEmpty());
			})
			.on('data', (chunk: Buffer) => {
				chunkLength += chunk.length;

				if (complete > 0) {
					progressNext += (chunk.length / complete) * 100;
					const progress = Math.min(Math.round(progressNext), 100);

					onUpdate?.({
						progress,
						message: `Downloading track: ${track.title} by ${track.artist.name} (${progress}%)`,
					});
				}
			});

		// 3. Run the pipeline with decryption and depadding
		try {
			await pipeline(requestStream, source => this.decrypter(source, isCryptedStream, blowfishKey), this.depadder, createWriteStream(writePath));
		} catch (error: any) {
			// Limpieza de archivo incompleto
			if (existsSync(writePath)) unlinkSync(writePath);

			if (signal?.aborted) throw new DownloadCanceled();

			const isEmpty = error instanceof DownloadEmpty || error?.cause instanceof DownloadEmpty || error?.code === 'DOWNLOAD_EMPTY';

			if (isEmpty) throw error;

			// Manage network errors and retry logic
			const isNetworkError =
				error instanceof ReadError ||
				error instanceof TimeoutError ||
				['ESOCKETTIMEDOUT', 'ERR_STREAM_PREMATURE_CLOSE', 'ETIMEDOUT', 'ECONNRESET'].includes(error?.code);

			// console.trace(error);
			if (isNetworkError) throw error;

			if (chunkLength !== 0 && complete > 0) {
				// Revert the progress to the last known state before the error
				progressNext -= (chunkLength / complete) * 100;
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
