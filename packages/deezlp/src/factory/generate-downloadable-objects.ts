import type { DeezerCore } from 'deezer';
import { parseLink } from '@/utils';
import type { DownloadableObject } from './DownloadableObject';
import { generateTrackItem } from './generate-track-item';
import { LinkNotRecognized, LinkNotSupported } from '@/exceptions';

/**
 * Generates downloadable objects based on a Deezer link and a specified bitrate.
 *
 * @param dz DeezerCore instance
 * @param link Deezer track ID or ISRC code
 * @param bitrate Desired bitrate for the track (e.g., 128 -> 1, 320 -> 3, flac -> 9)
 * @returns {Promise<DownloadableObject|DownloadableObject[]>} A promise that resolves to a Single track item
 */
export const generateDownloadableObjects = (dz: DeezerCore, link: string, bitrate: number): Promise<DownloadableObject | DownloadableObject[]> => {
	let linkType: string | undefined, linkId: string | undefined;

	[link, linkType, linkId] = parseLink(link);

	if (!linkType || !linkId) throw new LinkNotRecognized(link);

	if (linkType === 'track') return generateTrackItem(dz, linkId, bitrate);

	throw new LinkNotSupported(link);
};
