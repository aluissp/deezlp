import { LyricsStatus } from '@/constants';
import type { EnrichedDeezerTrack, TrackDataFetched } from '@/interfaces';
import { parseLyrics } from './parse-lyrics';

function isExplicit(explicitLyrics: number) {
	return [LyricsStatus.EXPLICIT, LyricsStatus.PARTIALLY_EXPLICIT].includes((explicitLyrics as any) || LyricsStatus.UNKNOWN);
}

export const enrichMissingTrackFields = (track: EnrichedDeezerTrack, data: Omit<TrackDataFetched, 'gwTrack'>): EnrichedDeezerTrack => {
	const { deezerTrack, gwTrackPage, gwLyrics } = data;

	// 1. Enrich track with gwTrackPage data
	track = enrichWithGwTrackPageData(track, gwTrackPage);

	// 2. Enrich track with gwLyrics data
	track = enrichWithGwLyricsData(track, gwLyrics);

	// 3. Enrich track with deezerTrack data
	track = enrichWithDeezerTrackData(track, deezerTrack);

	// 4. Get cover
	let cover: string;
	if (track?.album?.cover_small) {
		cover = track.album.cover_small;
	} else {
		cover = `https://e-cdns-images.dzcdn.net/images/cover/${track.md5_image}/75x75-000000-80-0-0.jpg`;
	}

	track.cover = cover;

	// 5. Parse lyrics if available
	if (track.gwLyrics) track.lyrics = parseLyrics(track.gwLyrics);

	return track;
};

const enrichWithGwTrackPageData = (track: EnrichedDeezerTrack, gwTrackPage: TrackDataFetched['gwTrackPage']): EnrichedDeezerTrack => {
	if (!gwTrackPage) return track;

	// 2. Enrich track with gwTrackPage data
	const data = gwTrackPage.DATA;

	track.available_countries = data.AVAILABLE_COUNTRIES.STREAM_ADS;
	track.disk_number = +data.DISK_NUMBER;
	track.copyright = data.COPYRIGHT;

	// Lyrics
	track.lyrics_id = +gwTrackPage.LYRICS.LYRICS_ID;
	track.explicit_lyrics = isExplicit(+data.EXPLICIT_LYRICS);
	track.gwLyrics = gwTrackPage.LYRICS;

	// Alternative albums
	track.alternative_albums = gwTrackPage.ISRC?.data?.map(isrc => ({
		id: +isrc.ALB_ID,
		title: isrc.ALB_TITLE,
		link: `https://www.deezer.com/album/${isrc.ALB_ID}`,
		cover: `https://api.deezer.com/album/${isrc.ALB_ID}/image`,
		cover_small: `https://e-cdns-images.dzcdn.net/images/cover/${isrc.ALB_PICTURE}/75x75-000000-80-0-0.jpg`, // before: /56x56-000000-80-0-0.jpg
		cover_medium: `https://e-cdns-images.dzcdn.net/images/cover/${isrc.ALB_PICTURE}/250x250-000000-80-0-0.jpg`,
		cover_big: `https://e-cdns-images.dzcdn.net/images/cover/${isrc.ALB_PICTURE}/500x500-000000-80-0-0.jpg`,
		cover_xl: `https://e-cdns-images.dzcdn.net/images/cover/${isrc.ALB_PICTURE}/1000x1000-000000-80-0-0.jpg`,
		md5_image: isrc.ALB_PICTURE,
		release_date: isrc.DIGITAL_RELEASE_DATE,
		tracklist: `https://api.deezer.com/album/${isrc.ALB_ID}/tracks`,
		type: 'album',
	}));

	return track;
};

const enrichWithGwLyricsData = (track: EnrichedDeezerTrack, gwLyrics: TrackDataFetched['gwLyrics']): EnrichedDeezerTrack => {
	if (!gwLyrics) return track;
	if (!track.lyrics_id) track.lyrics_id = +gwLyrics.LYRICS_ID;
	if (!track.lyrics) track.gwLyrics = gwLyrics;

	return track;
};

const enrichWithDeezerTrackData = (track: EnrichedDeezerTrack, deezerTrack: TrackDataFetched['deezerTrack']): EnrichedDeezerTrack => {
	if (!deezerTrack) return track;

	// Enrich track with deezerTrack data
	track.bpm = deezerTrack.bpm;
	if (!track.release_date) track.release_date = deezerTrack.release_date;

	return track;
};
