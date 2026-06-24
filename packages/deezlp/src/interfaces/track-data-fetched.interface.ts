import type { DeezerTrack, GWLyrics, GWTrack, GWTrackPage } from 'deezer';

export interface TrackDataFetched {
	deezerTrack?: DeezerTrack;
	gwTrack?: GWTrack;
	gwTrackPage?: GWTrackPage;
	gwLyrics?: GWLyrics;
}
