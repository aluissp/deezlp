/**
 * Parses a Deezer link and extracts its type and ID.
 * @param link The Deezer link to parse.
 * @returns [link, linkType, linkId], an array containing the original link, its type, and its ID.
 */
export const parseLink = (link: string): [string, string | undefined, string | undefined] => {
	// Remove query parameters and trailing slashes
	if (link.includes('?')) link = link.slice(0, link.indexOf('?'));
	if (link.includes('&')) link = link.slice(0, link.indexOf('&'));
	if (link.includes('/')) link = link.slice(0, -1);

	let linkType: string | undefined, linkId: string | undefined, linkData: RegExpExecArray | null;

	if (!link.includes('deezer')) return [link, linkType, linkId]; // return if not a deezer link

	if (link.search(/\/track\/(.+)/g) !== -1) {
		linkType = 'track';
		linkId = /\/track\/(.+)/g.exec(link)?.[1];
	} else if (link.search(/\/playlist\/(\d+)/g) !== -1) {
		linkType = 'playlist';
		linkId = /\/playlist\/(\d+)/g.exec(link)?.[1];
	} else if (link.search(/\/album\/(.+)/g) !== -1) {
		linkType = 'album';
		linkId = /\/album\/(.+)/g.exec(link)?.[1];
	} else if (link.search(/\/artist\/(\d+)\/top_track/g) !== -1) {
		linkType = 'artist_top';
		linkId = /\/artist\/(\d+)\/top_track/g.exec(link)?.[1];
	} else if (link.search(/\/artist\/(\d+)\/(.+)/g) !== -1) {
		linkData = /\/artist\/(\d+)\/(.+)/g.exec(link);
		linkType = `artist_${linkData?.[2]}`;
		linkId = linkData?.[1];
	} else if (link.search(/\/artist\/(\d+)/g) !== -1) {
		linkType = 'artist';
		linkId = /\/artist\/(\d+)/g.exec(link)?.[1];
	}

	return [link, linkType, linkId];
};
