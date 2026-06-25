import type { DeezerArtist, DeezerTrack, GwAlbum, GWLyrics, GWTrack, GWTrackPage } from 'deezer';

export interface TrackDataFetched {
	deezerTrack?: DeezerTrack;
	deezerArtist?: DeezerArtist;
	gwTrack?: GWTrack;
	gwTrackPage?: GWTrackPage;
	gwLyrics?: GWLyrics;
	gwAlbum?: GwAlbum;
}
