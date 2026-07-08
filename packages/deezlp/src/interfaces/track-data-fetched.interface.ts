import type { DeezerArtist, DeezerFullAlbum, DeezerTrack, GwAlbum, GWLyrics, GWTrack, GWTrackPage } from 'deezer';

export interface TrackDataFetched {
	deezerTrack?: DeezerTrack;
	deezerArtist?: DeezerArtist;
	deezerFullAlbum?: DeezerFullAlbum;
	gwTrack?: GWTrack;
	gwTrackPage?: GWTrackPage;
	gwLyrics?: GWLyrics;
	gwAlbum?: GwAlbum;
}
