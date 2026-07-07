import { createHash } from 'crypto';
import { Blowfish } from 'egoroof-blowfish';

export class CryptoService {
	/** Generates an MD5 hash of the given data */
	private md5(data: string, type: BufferEncoding = 'binary') {
		const md5sum = createHash('md5');
		md5sum.update(Buffer.from(data, type));
		return md5sum.digest('hex');
	}

	/** Generates a Blowfish key based on the track ID */
	generateBlowfishKey(trackId: number): string {
		const SECRET = 'g4el58wc0zvf9na1';
		const idMd5 = this.md5(trackId.toString(), 'ascii');

		let bfKey = '';

		for (let i = 0; i < 16; i++) {
			bfKey += String.fromCharCode(idMd5.charCodeAt(i) ^ idMd5.charCodeAt(i + 16) ^ SECRET.charCodeAt(i));
		}

		return bfKey;
	}

	/** Decrypts a chunk of data using the provided Blowfish key */
	decryptChunk(chunk: Buffer, blowFishKey: string) {
		const bf = new Blowfish(blowFishKey, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);

		bf.setIv(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]));

		const decrypted = bf.decode(chunk, Blowfish.TYPE.UINT8_ARRAY);

		return Buffer.from(decrypted);
	}
}
