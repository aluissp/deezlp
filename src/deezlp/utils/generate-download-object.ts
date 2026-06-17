import type { DeezerCore } from '../../deezer';
import { generateTrackItem } from '../downloadable-objects/generate-track-item';
import { LinkNotRecognized } from '../exceptions';
import { parseLink } from './parse-link';

export const generateDownloadObject = (dz: DeezerCore, link: string, bitrate: number) => {
	let linkType: string | undefined, linkId: string | undefined;

	[link, linkType, linkId] = parseLink(link);

	if (!linkType || !linkId) throw new LinkNotRecognized(link);

	if (linkType === 'track') return generateTrackItem(dz, linkId, bitrate);
};
