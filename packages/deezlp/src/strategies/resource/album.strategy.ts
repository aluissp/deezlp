import { fetchAlbum } from '@/fetch';
import { type ResolvedURL } from '@/resolvers';
import type { DeezerCore, TRACK_FORMATS } from 'deezer';
import type { AlbumDownloadPayload } from '@/entities';
import type { ResourceStrategy } from './resource.strategy';
import { buildEnrichedTrackFromData } from './build-enriched-track-from-data';

export class AlbumStrategy implements ResourceStrategy {
	public async process(
		resolvedUrl: ResolvedURL,
		dz: DeezerCore,
		setting: { bitrate: (typeof TRACK_FORMATS)[keyof typeof TRACK_FORMATS] },
	): Promise<AlbumDownloadPayload> {
		const trackList = await fetchAlbum(dz, resolvedUrl, { includeAlbumInfo: true, includeArtistInfo: true });

		const enrichedTracks = trackList.map(trackData => buildEnrichedTrackFromData(trackData, setting.bitrate));

		return { enrichedTracks, downloadProgress: [], type: 'album' };
	}
}
