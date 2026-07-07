import { LyricsStatus } from '@/constants';
import { parseLyrics } from './parse-lyrics';
import type { EnrichedDeezerAlbum, EnrichedDeezerArtist, EnrichedDeezerTrack, TrackDataFetched } from '@/interfaces';

export function isExplicit(explicitLyrics: number) {
	return [LyricsStatus.EXPLICIT, LyricsStatus.PARTIALLY_EXPLICIT].includes((explicitLyrics as any) || LyricsStatus.UNKNOWN);
}

export const enrichMissingTrackFields = (track: EnrichedDeezerTrack, data: Omit<TrackDataFetched, 'gwTrack'>): EnrichedDeezerTrack => {
	const { deezerTrack, deezerArtist, gwTrackPage, gwLyrics, gwAlbum } = data;

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

	// 6. Enrich track with album data
	track = enrichWithAlbumData(track, gwAlbum);

	// 7. Enrich track with artist data
	track = enrichWithDeezerArtistData(track, deezerArtist);

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

	// Fallback ID if exists
	if (track?.fallback_id) track.fallback_id = data.FALLBACK?.SNG_ID ? +data.FALLBACK.SNG_ID : undefined;

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

	if (!track.title_short) track.title_short = deezerTrack.title_short;
	if (!track.release_date) track.release_date = deezerTrack.release_date;
	if (!track.duration) track.duration = deezerTrack.duration;
	if (!track.track_position) track.track_position = deezerTrack.track_position;
	if (!track.disk_number) track.disk_number = deezerTrack.disk_number;
	if (!track.preview) track.preview = deezerTrack.preview;
	if (!track.rank) track.rank = deezerTrack.rank;
	if (!track.md5_image) track.md5_image = deezerTrack.md5_image;
	if (!track.gain) track.gain = deezerTrack.gain;
	if (!track.share) track.share = deezerTrack.share;

	return track;
};

const enrichWithAlbumData = (track: EnrichedDeezerTrack, gwAlbum: TrackDataFetched['gwAlbum']): EnrichedDeezerTrack => {
	if (!gwAlbum) return track;

	// Enrich track with album data
	const albumData: EnrichedDeezerAlbum = {
		id: +gwAlbum.ALB_ID,
		title: gwAlbum.ALB_TITLE,
		link: `https://www.deezer.com/album/${gwAlbum.ALB_ID}`,
		share: `https://www.deezer.com/album/${gwAlbum.ALB_ID}`,
		cover: `https://api.deezer.com/album/${gwAlbum.ALB_ID}/image`,
		cover_small: `https://cdns-images.dzcdn.net/images/cover/${gwAlbum.ALB_PICTURE}/56x56-000000-80-0-0.jpg`,
		cover_medium: `https://cdns-images.dzcdn.net/images/cover/${gwAlbum.ALB_PICTURE}/250x250-000000-80-0-0.jpg`,
		cover_big: `https://cdns-images.dzcdn.net/images/cover/${gwAlbum.ALB_PICTURE}/500x500-000000-80-0-0.jpg`,
		cover_xl: `https://cdns-images.dzcdn.net/images/cover/${gwAlbum.ALB_PICTURE}/1000x1000-000000-80-0-0.jpg`,
		md5_image: gwAlbum.ALB_PICTURE,
		label: gwAlbum.LABEL_NAME,
		duration: undefined, // not provided
		fans: gwAlbum.NB_FAN,
		release_date: gwAlbum.PHYSICAL_RELEASE_DATE,
		record_type: undefined, // not provided
		// alternative: undefined, // not provided
		contributors: [],
		tracklist: `https://api.deezer.com/album/${gwAlbum.ALB_ID}/tracks`,
		explicit_lyrics: isExplicit(gwAlbum.EXPLICIT_ALBUM_CONTENT.EXPLICIT_LYRICS_STATUS),
		explicit_content_lyrics: gwAlbum.EXPLICIT_ALBUM_CONTENT.EXPLICIT_LYRICS_STATUS,
		explicit_content_cover: gwAlbum.EXPLICIT_ALBUM_CONTENT.EXPLICIT_COVER_STATUS,
		artist: {
			id: +gwAlbum.ART_ID,
			name: gwAlbum.ART_NAME,
			link: `https://www.deezer.com/artist/${gwAlbum.ART_ID}`,
			type: 'artist',
			picture: '',
			radio: false,
			// Extras
			// rank: gwAlbum.RANK_ART,
		},
		tracks: [], // not provided
		// Extras
		rating: gwAlbum.RANK,
		digital_release_date: gwAlbum.DIGITAL_RELEASE_DATE,
		physical_release_date: gwAlbum.PHYSICAL_RELEASE_DATE,
		original_release_date: gwAlbum.ORIGINAL_RELEASE_DATE,
		genre_id: +gwAlbum.GENRE_ID,
		genres: [], // not provided
		nb_tracks: +gwAlbum.NUMBER_TRACK,
		nb_disk: +gwAlbum.NUMBER_DISK,
		copyright: gwAlbum.COPYRIGHT,
		type: gwAlbum.__TYPE__ as 'album',
	};

	if (!track.album) {
		track.album = albumData;
		return track;
	}

	if (!track?.album?.id) track.album.id = albumData.id;
	if (!track?.album?.title) track.album.title = albumData.title;
	if (!track?.album?.link) track.album.link = albumData.link;
	if (!track?.album?.share) track.album.share = albumData.share;
	if (!track?.album?.cover) track.album.cover = albumData.cover;
	if (!track?.album?.cover_small) track.album.cover_small = albumData.cover_small;
	if (!track?.album?.cover_medium) track.album.cover_medium = albumData.cover_medium;
	if (!track?.album?.cover_big) track.album.cover_big = albumData.cover_big;
	if (!track?.album?.cover_xl) track.album.cover_xl = albumData.cover_xl;
	if (!track?.album?.md5_image) track.album.md5_image = albumData.md5_image;
	if (!track?.album?.genres) track.album.genres = albumData.genres;
	if (!track?.album?.label) track.album.label = albumData.label;
	if (!track?.album?.duration) track.album.duration = albumData.duration;
	if (!track?.album?.fans) track.album.fans = albumData.fans;
	if (!track?.album?.release_date) track.album.release_date = albumData.release_date;
	if (!track?.album?.record_type) track.album.record_type = albumData.record_type;
	if (!track?.album?.contributors) track.album.contributors = albumData.contributors;
	if (!track?.album?.tracklist) track.album.tracklist = albumData.tracklist;
	if (!track?.album?.explicit_lyrics) track.album.explicit_lyrics = albumData.explicit_lyrics;
	if (!track?.album?.explicit_content_lyrics) track.album.explicit_content_lyrics = albumData.explicit_content_lyrics;
	if (!track?.album?.explicit_content_cover) track.album.explicit_content_cover = albumData.explicit_content_cover;
	if (!track?.album?.artist) track.album.artist = albumData.artist;
	if (!track?.album?.rating) track.album.rating = albumData.rating;
	if (!track?.album?.digital_release_date) track.album.digital_release_date = albumData.digital_release_date;
	if (!track?.album?.physical_release_date) track.album.physical_release_date = albumData.physical_release_date;
	if (!track?.album?.original_release_date) track.album.original_release_date = albumData.original_release_date;
	if (!track?.album?.genre_id) track.album.genre_id = albumData.genre_id;
	if (!track?.album?.nb_tracks) track.album.nb_tracks = albumData.nb_tracks;
	if (!track?.album?.nb_disk) track.album.nb_disk = albumData.nb_disk;
	if (!track?.album?.copyright) track.album.copyright = albumData.copyright;
	if (!track?.album?.type) track.album.type = albumData.type;

	return track;
};

const enrichWithDeezerArtistData = (track: EnrichedDeezerTrack, deezerArtist: TrackDataFetched['deezerArtist']): EnrichedDeezerTrack => {
	if (!deezerArtist) return track;

	// Enrich track with album data
	const artistData: EnrichedDeezerArtist = {
		id: deezerArtist.id,
		name: deezerArtist.name,
		link: deezerArtist.link,
		picture: deezerArtist.picture,
		picture_small: deezerArtist.picture_small,
		picture_medium: deezerArtist.picture_medium,
		picture_big: deezerArtist.picture_big,
		picture_xl: deezerArtist.picture_xl,
		radio: deezerArtist.radio,
		share: deezerArtist.share,
		tracklist: deezerArtist.tracklist,
		md5_image: deezerArtist.md5_image,
		// Extras
		role: undefined, // not provided
		nb_album: deezerArtist.nb_album,
		nb_fan: deezerArtist.nb_fan,
		type: deezerArtist.type as 'artist',
	};

	if (!track.artist) {
		track.artist = artistData;
		return track;
	}

	if (!track?.artist?.id) track.artist.id = artistData.id;
	if (!track?.artist?.name) track.artist.name = artistData.name;
	if (!track?.artist?.link) track.artist.link = artistData.link;
	if (!track?.artist?.picture) track.artist.picture = artistData.picture;
	if (!track?.artist?.picture_small) track.artist.picture_small = artistData.picture_small;
	if (!track?.artist?.picture_medium) track.artist.picture_medium = artistData.picture_medium;
	if (!track?.artist?.picture_big) track.artist.picture_big = artistData.picture_big;
	if (!track?.artist?.picture_xl) track.artist.picture_xl = artistData.picture_xl;
	if (!track?.artist?.radio) track.artist.radio = artistData.radio;
	if (!track?.artist?.share) track.artist.share = artistData.share;
	if (!track?.artist?.tracklist) track.artist.tracklist = artistData.tracklist;
	if (!track?.artist?.md5_image) track.artist.md5_image = artistData.md5_image;
	// if (!track?.artist?.role) track.artist.role = artistData.role; if not provided, we don't overwrite it
	if (!track?.artist?.nb_album) track.artist.nb_album = artistData.nb_album;
	if (!track?.artist?.nb_fan) track.artist.nb_fan = artistData.nb_fan;
	if (!track?.artist?.type) track.artist.type = artistData.type;

	// If the md5_image is missing, we extract it from the picture_small URL if available
	if (!track?.artist?.md5_image && track?.artist?.picture_small) {
		track.artist.md5_image = track.artist.picture_small.match(/artist\/([^/]+)/)?.[1];
	}

	return track;
};
