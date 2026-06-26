import { NotLoggedInException } from '@/exceptions';
import type { EnrichedDeezerTrack } from '@/interfaces';
import { FORMATS_360, FORMATS_NO_360, TRACK_FORMAT_NAMES, TRACK_FORMATS, WrongLicense, type DeezerCore } from 'deezer';

export class DeezerTrackUrlResolver {
	constructor(
		// private httpService: HttpService,
		// private cryptoService: CryptoService,
		private dz: DeezerCore,
	) {}

	public async resolve(track: EnrichedDeezerTrack, options?: { shouldFallback: boolean; feelingLucky: boolean }): Promise<void> {
		// 1. Get preferred bitrate
		const preferredBitrate = track.bitrate ?? TRACK_FORMATS.MP3_128;

		// 2. Validate and renew token if necessary
		await this.checkAndRenewTrackToken(track);

		// 3. Validate user licenses
		this.validateUserLicenses(preferredBitrate);

		// 4. Get formats to try based on preferred bitrate option
		const formatsToTry = this.getFormatsByBitrate(preferredBitrate);

		for (const format of formatsToTry) {
			let currentTrack = track;
			// let url = await this.dz.getTrackUrl(currentTrack, format);
			// Si falla el método oficial y tiene "feelingLucky", usar el método viejo (Crypto)
			// if (!url && options.feelingLucky) {
			// 	const legacyUrl = this.cryptoService.generateLegacyUrl(currentTrack, format);
			// 	if (await this.httpService.isValidUrl(legacyUrl)) url = legacyUrl;
			// }
			// // Paso 3: Lógica de Fallback de la canción (Buscar alternativa si está geobloqueada)
			// while (!url && currentTrack.hasAlternative) {
			// 	currentTrack = await this.dz.getAlternativeTrack(currentTrack.fallbackID);
			// 	url = await this.dz.getTrackUrl(currentTrack, format);
			// }
			// if (url) {
			// 	return { url, format: format.number };
			// }
			// // Si no debe bajarse la calidad (shouldFallback = false), lanzar excepciones de negocio aquí
			// if (!options.shouldFallback) this.throwBusinessException(format);
			// throw new PreferredBitrateNotFound();
		}
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
}
