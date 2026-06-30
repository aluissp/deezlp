import { fetchTrack } from '@/fetch';
import { NotLoggedInException } from '@/exceptions';
import type { EnrichedDeezerTrack } from '@/interfaces';
import { FORMATS_360, FORMATS_NO_360, TRACK_FORMAT_NAMES, TRACK_FORMATS, WrongLicense, type DeezerCore } from 'deezer';

export class DeezerTrackUrlResolver {
	constructor(private dz: DeezerCore) {}

	/**
	 * Resolves the urls for a given Deezer track based on the preferred bitrate.
	 * @param track The enriched Deezer track object containing track information and token.
	 * @param options Optional parameters for resolving the track URL (this should remove)
	 * @returns A promise that resolves to the (bitrate/url) and set it in `track.bitrate`, `track.urls[formatName] = url` and `track.album.bitrate` if available.
	 */
	public async resolve(track: EnrichedDeezerTrack, options?: { shouldFallback: boolean; feelingLucky: boolean }): Promise<void> {
		// 1. Get preferred bitrate
		let preferredBitrate = track.bitrate ?? TRACK_FORMATS.MP3_128;

		// 2. Validate and renew token if necessary
		await this.checkAndRenewTrackToken(track);

		// 3. Validate user licenses
		this.validateUserLicenses(preferredBitrate);

		// 4. Get formats to try based on preferred bitrate option
		const formatsToTry = this.getFormatsByBitrate(preferredBitrate);

		// 5. Try to get the URL for each format until one is found
		let foundBitrate: number | undefined = undefined;
		for (const format of formatsToTry) {
			foundBitrate = await this.getUrlFromDeezer(track, format.bitrate);
			if (foundBitrate) break;
		}

		track.bitrate = (foundBitrate as any) ?? preferredBitrate;
		// if(track?.album?.bitrate)track.album.bitrate = (foundBitrate as any) ?? preferredBitrate;
	}

	private async checkAndRenewTrackToken(track: EnrichedDeezerTrack): Promise<void> {
		const now = new Date();
		const expiration = track.track_token_expire ? new Date(track.track_token_expire * 1000) : null;

		if (!expiration || now >= expiration) {
			const newTrack = await this.dz.gw.getTrack(track.id);
			track.track_token = newTrack.TRACK_TOKEN;
			track.track_token_expire = newTrack.TRACK_TOKEN_EXPIRE;
		}
	}

	private validateUserLicenses(preferredBitrate: number): void {
		const user = this.dz.currentUser;

		if (!this.dz.loggedIn || !user)
			throw new NotLoggedInException('You must be logged in to download tracks! Use arl or username/password to log in.');

		// Validate if is free user
		const canStreamStandard = FORMATS_NO_360.MP3_128 === preferredBitrate;

		if (canStreamStandard) return;

		const isFLACLicense = TRACK_FORMATS.FLAC === preferredBitrate;
		const is360Format = Object.values(FORMATS_360).includes(preferredBitrate as any);

		const canStreamLossless = (isFLACLicense || is360Format) && user.can_stream_lossless;
		const canStreamHq = FORMATS_NO_360.MP3_320 === preferredBitrate && user.can_stream_hq;

		const formatName = TRACK_FORMAT_NAMES[preferredBitrate as keyof typeof TRACK_FORMAT_NAMES] ?? 'Unknown Format';

		if (!canStreamLossless && !canStreamHq) throw new WrongLicense(formatName);
	}

	private getFormatsByBitrate(preferredBitrate: number): { name: string; bitrate: number }[] {
		const is360Format = Object.values(FORMATS_360).includes(preferredBitrate as any);
		const selectedFormats = is360Format ? FORMATS_360 : FORMATS_NO_360;

		return Object.entries(selectedFormats)
			.map(([name, bitrate]) => ({ name, bitrate })) // Map selected formats
			.sort((a, b) => b.bitrate - a.bitrate) // Sort by bitrate descending, from highest to lowest quality
			.filter(format => format.bitrate <= preferredBitrate); // Filter formats that are less than or equal to the preferred bitrate
	}

	/**
	 * Gets the URL for a specific track and format from Deezer.
	 * If the URL is not available, will try to get the URL from an alternative track if available.
	 * @param track The enriched Deezer track object containing track information and token.
	 * @param format The desired format for the track URL
	 * @returns A promise that resolves to the track URL
	 */
	private async getUrlFromDeezer(track: EnrichedDeezerTrack, format: number): Promise<number | undefined> {
		const formatName = TRACK_FORMAT_NAMES[format as keyof typeof TRACK_FORMAT_NAMES];

		const urlData = await this.dz.getTrackUrl(track.track_token, formatName).catch(() => undefined);

		if (!urlData) return undefined;

		let url = urlData.media?.[0]?.sources?.[0]?.url;
		let size = urlData.media?.[0]?.filesize ?? 0;
		let alternativeId = track.fallback_id !== 0 ? String(track.fallback_id) : undefined;

		if (url) {
			// track.urls = { [formatName]: url };
			track.media = { url, bitrate: format, formatName, size };
			return format; // Return the correct format number
		}

		// Try to get the URL from an alternative track if available
		while (!url && !!alternativeId) {
			const alternativeTrack = await fetchTrack(
				this.dz,
				{ id: alternativeId, kind: 'id', type: 'track' },
				{ includeAlbumInfo: false, includeArtistInfo: false },
			);

			[url, size] = await this.dz
				.getTrackUrl(alternativeTrack?.gwTrack?.TRACK_TOKEN ?? '', formatName)
				.then(data => [data?.media?.[0]?.sources?.[0]?.url, data?.media?.[0]?.filesize ?? 0]); // [url, size]
			alternativeId = alternativeTrack?.gwTrackPage?.DATA?.FALLBACK?.SNG_ID;
		}

		if (!url) return;

		// Return the correct format number and set the URL in the track object
		// track.urls = { [formatName]: url };
		track.media = { url, bitrate: format, formatName, size };
		return format;
	}
}
