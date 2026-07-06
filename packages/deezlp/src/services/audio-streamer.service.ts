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
	 * Decrypts the incoming stream if it is encrypted, otherwise passes it through unchanged.
	 *
	 * @param source The source stream of data to be decrypted
	 * @param isCrypted Indicates whether the stream is encrypted
	 * @param blowfishKey The Blowfish key used for decryption, if applicable
	 * @returns
	 */
	private async *decrypter(
		source: AsyncIterable<Buffer>,
		isCrypted: boolean,
		blowfishKey?: string,
	): AsyncGenerator<Buffer<ArrayBufferLike>, void, any> {
		// if the stream is not encrypted or no blowfish key is provided, yield the source directly
		if (!isCrypted || !blowfishKey) {
			yield* source;
			return;
		}

		let modifiedStream = Buffer.alloc(0);
		for await (const chunk of source) {
			modifiedStream = Buffer.concat([modifiedStream, chunk]);

			while (modifiedStream.length >= 2048 * 3) {
				/**
				 * 1. Decrypt the first 6144 bytes of the chunk
				 * ```text
				 * 	[ 0, 1, 2, ..., 6143 bytes ]
				 * 	+-----------------------------------+
				 * 	| 2048      | 2048      | 2048      |
				 * 	| Decrypt   | Unchanged | Unchanged |
				 * 	+-----------------------------------+
				 * ```
				 */
				const decryptingChunks = modifiedStream.subarray(0, 2048 * 3);
				/**
				 * 2. Remove the first 6144 bytes from the modified stream
				 * ```text
				 * [6144, 6145, 6146, ..., n bytes to keep]
				 *	+---------------------------------------+
				 * 	| 0, ..., 6143      | 6144, ... n bytes |
				 * 	| To remove					| To keep						|
				 * 	+---------------------------------------+
				 * ```
				 */
				modifiedStream = modifiedStream.subarray(2048 * 3);
				/**
				 * 3. Decrypt the first 2048 bytes of the chunk
				 * ```text
				 * [0, 1, 2, ..., 2047 bytes encrypted]
				 * ```
				 */
				let decryptedChunks = this.cryptoService.decryptChunk(decryptingChunks.subarray(0, 2048), blowfishKey);
				/**
				 * 4. Concatenate the decrypted first 2048 bytes with the remaining bytes of the chunk
				 * ```text
				 * 	[ 0, ..., 2047 bytes decrypted ] + [ 2048, ..., 6143 bytes unchanged ]
				 * ```
				 */
				decryptedChunks = Buffer.concat([decryptedChunks, decryptingChunks.subarray(2048)]);

				// 5. Yield the decrypted chunk
				yield decryptedChunks;
			}
		}

		// 6. If there are any remaining bytes in the modified stream,
		// decrypt the first 2048 bytes if possible and yield the result
		if (modifiedStream.length > 0) {
			if (modifiedStream.length >= 2048) {
				/**
				 * We assuming that the remaining bytes are at least 2048 bytes long
				 * ```text
				 * 	[ 0, 1, 2, ..., n bytes where n >= 2048 and n < 6144 ]
				 * 	+-----------------------------------+
				 * 	| 2048      | 2049, ..., n bytes    |
				 * 	| Decrypt   | Unchanged 						|
				 * 	+-----------------------------------+
				 * ```
				 */
				let decryptedChunks = this.cryptoService.decryptChunk(modifiedStream.subarray(0, 2048), blowfishKey);
				// Concat with the remaining bytes of the modified stream
				decryptedChunks = Buffer.concat([decryptedChunks, modifiedStream.subarray(2048)]);

				yield decryptedChunks;
			} else {
				/**
				 * We assuming that the remaining bytes are less than 2048 bytes long, so we yield them unchanged
				 * ```text
				 * 	[ 0, 1, 2, ..., n bytes where n < 2048 ]
				 * 	+-----------------------+
				 * 	| 0, ..., 2046 bytes    |
				 * 	| Unchanged 						|
				 * 	+-----------------------+
				 * ```
				 */
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
