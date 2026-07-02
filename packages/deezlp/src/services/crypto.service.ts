import { createHash } from 'crypto';
import { Blowfish } from 'egoroof-blowfish';

export class CryptoService {
	private md5(data: string, type: BufferEncoding = 'binary') {
		const md5sum = createHash('md5');
		md5sum.update(Buffer.from(data, type));
		return md5sum.digest('hex');
	}

	generateBlowfishKey(trackId: number) {
		const SECRET = 'g4el58wc0zvf9na1';
		const idMd5 = this.md5(trackId.toString(), 'ascii');
		let bfKey = '';
		for (let i = 0; i < 16; i++) {
			bfKey += String.fromCharCode(idMd5.charCodeAt(i) ^ idMd5.charCodeAt(i + 16) ^ SECRET.charCodeAt(i));
		}
		return String(bfKey);
	}

	decryptChunk(chunk: Buffer, blowFishKey: string) {
		// const ciphers = getCiphers();
		// // if (ciphers.includes('bf-cbc'))
		// const cipher = createDecipheriv('bf-cbc', blowFishKey, Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]));
		// cipher.setAutoPadding(false);
		// return Buffer.concat([cipher.update(chunk), cipher.final()]);

		// if (Blowfish) {
		// 	const cipher = new Blowfish(blowFishKey, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
		// 	cipher.setIv(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]));
		// 	return Buffer.from(cipher.decode(chunk, Blowfish.TYPE.UINT8_ARRAY));
		// }

		const bf = new Blowfish(blowFishKey, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
		bf.setIv(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]));

		const decrypted = bf.decode(chunk, Blowfish.TYPE.UINT8_ARRAY);

		return Buffer.from(decrypted);
	}
}
