// Re-exporting only available AUDIO_QUALITIES for external usage
import { FORMATS_NO_360 } from 'deezer';

export const AUDIO_QUALITIES = {
	/** FLAC format, lossless quality */
	FLAC: FORMATS_NO_360.FLAC,
	/** 320 kbps, high quality */
	MP3_320: FORMATS_NO_360.MP3_320,
	/** 128 kbps, standard quality */
	MP3_128: FORMATS_NO_360.MP3_128,
} as const;
