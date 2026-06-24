import { sanitizeUrl } from '@/utils';
import { LinkNotRecognized } from '@/exceptions';

/**
 * Determine if a id is:
 * - an id: 123456789
 * - an isrc: USUM71703861
 * - a upc: 602557933736
 */
export type IDKind = 'id' | 'isrc' | 'upc';

/**
 * Determine if a url is a:
 * - track: https://www.deezer.com/track/123456789
 * - album: https://www.deezer.com/album/123456789
 * - playlist: https://www.deezer.com/playlist/123456789
 * - artist: https://www.deezer.com/artist/123456789
 */
export type URLType = 'track' | 'album' | 'playlist' | 'artist' | 'artist_top' | `artist_${string}`;

/**
 * Represents a resolved URL with its ID, ID kind, and URL type.
 * - id: 123456789
 * - kind: 'id' | 'isrc' | 'upc'
 * - type: 'track' | 'album' | 'playlist' | 'artist'
 */
export interface ResolvedURL {
	id: string;
	kind: IDKind;
	type: URLType;
}

type ResolverRule = (url: string) => ResolvedURL | undefined;

const resolveUrl: ResolverRule = url => {
	if (!url.includes('deezer')) return undefined; // return undefined if not a deezer link

	let match = url.match(/\/track\/(.+)/);
	if (match?.[1]) return { type: 'track', id: match[1], kind: 'id' };

	match = url.match(/\/playlist\/(\d+)/);
	if (match?.[1]) return { type: 'playlist', id: match[1], kind: 'id' };

	match = url.match(/\/album\/(.+)/);
	if (match?.[1]) return { type: 'album', id: match[1], kind: 'id' };

	match = url.match(/\/artist\/(\d+)\/top_track/);
	if (match?.[1]) return { type: 'artist_top', id: match[1], kind: 'id' };

	// Artist sub-routes (ej. artist/123/albums)
	match = url.match(/\/artist\/(\d+)\/(.+)/);
	if (match?.[1]) return { type: `artist_${match?.[2] ?? ''}`, id: match[1], kind: 'id' };

	// Artist Generic
	match = url.match(/\/artist\/(\d+)/);
	if (match?.[1]) return { type: 'artist', id: match[1], kind: 'id' };

	return undefined;
};

const resolveNumericId: ResolverRule = id => {
	if (!/^\d+$/.test(id)) return undefined;

	return { type: 'track', id, kind: 'id' };
};

const resolveISRC: ResolverRule = id => {
	if (!id.toLowerCase().startsWith('isrc:')) return undefined;

	return { type: 'track', id: id.slice(5), kind: 'isrc' };
};

const resolveUPC: ResolverRule = id => {
	if (!id.toLowerCase().startsWith('upc:')) return undefined;

	return { type: 'album', id: id.slice(4), kind: 'upc' };
};

const rules: ResolverRule[] = [resolveUrl, resolveNumericId, resolveISRC, resolveUPC];

/**
 * Resolves a Deezer URL to its corresponding ID, ID kind, and URL type.
 *
 * @param url The Deezer URL to resolve.
 * @returns The resolved URL information.
 */
export const resolveDeezerUrl = (url: string): ResolvedURL => {
	const cleanUrl = sanitizeUrl(url);

	for (const rule of rules) {
		const result = rule(cleanUrl);
		if (result) return result;
	}

	throw new LinkNotRecognized(url);
};
