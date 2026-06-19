import type { GWTrack } from 'deezer';
import type { EnrichedDeezerAlbum, EnrichedDeezerArtist, EnrichedDeezerContributor, EnrichedDeezerTrack } from '@/interfaces';

export const RoleID = ['Main', null, null, null, null, 'Featured'];

export const mapGwTrackToDeezer = (track: GWTrack): EnrichedDeezerTrack => {
	// 1. Map title
	const titleVersion = (track.VERSION || '').trim();
	const titleShort = titleVersion && track.SNG_TITLE?.includes(titleVersion) ? track.SNG_TITLE.replace(titleVersion, '').trim() : track.SNG_TITLE;

	// 2. Map artist
	const artist: EnrichedDeezerArtist = {
		id: +track.ART_ID,
		name: track.ART_NAME,
		link: `https://www.deezer.com/artist/${track.ART_ID}`,
		share: `https://www.deezer.com/artist/${track.ART_ID}`,
		picture: `https://www.deezer.com/artist/${track.ART_ID}/image`,
		radio: false, // not provided
		tracklist: `https://api.deezer.com/artist/${track.ART_ID}/top?limit=50`,
		type: 'artist',
	};

	// 3. Map album
	const album = {
		id: +track.ALB_ID,
		title: track.ALB_TITLE,
		link: `https://www.deezer.com/album/${track.ALB_ID}`,
		cover: `https://api.deezer.com/album/${track.ALB_ID}/image`,
		cover_small: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/75x75-000000-80-0-0.jpg`, // before: /56x56-000000-80-0-0.jpg
		cover_medium: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/250x250-000000-80-0-0.jpg`,
		cover_big: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/500x500-000000-80-0-0.jpg`,
		cover_xl: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/1000x1000-000000-80-0-0.jpg`,
		md5_image: track.ALB_PICTURE,
		release_date: null, // not provided
		tracklist: `https://api.deezer.com/album/${track.ALB_ID}/tracks`,
		type: 'album',
	} satisfies EnrichedDeezerAlbum;

	// 4. Map filesize
	const rawFilesizes = {
		default: track.FILESIZE,
		aac_64: track.FILESIZE_AAC_64,
		mp3_64: track.FILESIZE_MP3_64,
		mp3_128: track.FILESIZE_MP3_128,
		mp3_256: track.FILESIZE_MP3_256,
		mp3_320: track.FILESIZE_MP3_320,
		mp4_ra1: track.FILESIZE_MP4_RA1,
		mp4_ra2: track.FILESIZE_MP4_RA2,
		mp4_ra3: track.FILESIZE_MP4_RA3,
		flac: track.FILESIZE_FLAC,
	};
	const filesizes = Object.entries(rawFilesizes).reduce(
		(obj, [key, value]) => {
			let size = +value;

			if (isNaN(size)) size = 0;

			obj[key] = size;

			return obj;
		},
		{} as Record<string, number>,
	);

	// 5. Map Contributors
	const contributors: EnrichedDeezerContributor[] = (track.ARTISTS || []).map(contributor => ({
		id: +contributor.ART_ID,
		name: contributor.ART_NAME,
		link: `https://www.deezer.com/artist/${contributor.ART_ID}`,
		share: `https://www.deezer.com/artist/${contributor.ART_ID}`,
		picture: `https://www.deezer.com/artist/${contributor.ART_ID}/image`,
		picture_small: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/75x75-000000-80-0-0.jpg`, // before: /56x56-000000-80-0-0.jpg
		picture_medium: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/250x250-000000-80-0-0.jpg`,
		picture_big: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/500x500-000000-80-0-0.jpg`,
		picture_xl: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/1000x1000-000000-80-0-0.jpg`,
		md5_image: contributor.ART_PICTURE,
		tracklist: `https://api.deezer.com/artist/${contributor.ART_ID}/top?limit=50`,
		type: 'artist',
		role: RoleID[+contributor.ROLE_ID],
		// Extras
		order: contributor.ARTISTS_SONGS_ORDER,
		rank: +contributor.RANK,
	}));

	// 6. Enrich main artist
	const mainArtist = contributors.find(contributor => contributor.id === artist?.id);

	if (mainArtist && artist) {
		artist.picture_small = mainArtist.picture_small;
		artist.picture_medium = mainArtist.picture_medium;
		artist.picture_big = mainArtist.picture_big;
		artist.picture_xl = mainArtist.picture_xl;
		artist.md5_image = mainArtist.md5_image;
	}

	// 7. Get song contributors
	const song_contributors: string[] = [];

	const addSongContributors = (name: string) => {
		const nameNormalized = name.trim().toLowerCase();

		if (song_contributors.find(sngCon => sngCon.toLowerCase().includes(nameNormalized) || nameNormalized.includes(sngCon.toLowerCase()))) return;

		song_contributors.push(name);
	};

	track.SNG_CONTRIBUTORS?.main_artist?.forEach(addSongContributors);
	track.SNG_CONTRIBUTORS?.composer?.forEach(addSongContributors);
	track.SNG_CONTRIBUTORS?.author?.forEach(addSongContributors);

	return {
		id: +track.SNG_ID,
		readable: true, // not provided
		unseen: false, // not provided
		title_short: titleShort,
		user_id: track.USER_ID,
		title_version: titleVersion,
		title: `${titleShort} ${titleVersion}`.trim(),
		isrc: track.ISRC,
		link: `https://www.deezer.com/track/${track.SNG_ID}`,
		share: `https://www.deezer.com/track/${track.SNG_ID}`,
		duration: +track.DURATION,
		bpm: null, // not provided
		available_countries: [], // not provided
		md5_image: track.ALB_PICTURE,
		// Extras
		md5_origin: track.MD5_ORIGIN,
		media_version: track.MEDIA_VERSION,
		token: track.TRACK_TOKEN,
		track_token: track.TRACK_TOKEN,
		track_token_expire: track.TRACK_TOKEN_EXPIRE,
		track_position: +track.TRACK_NUMBER,
		disk_number: +track.DISK_NUMBER,
		rank: +track.RANK,
		release_date: track.PHYSICAL_RELEASE_DATE,
		explicit_lyrics: Boolean(track.EXPLICIT_LYRICS),
		explicit_content_lyrics: track.EXPLICIT_TRACK_CONTENT?.EXPLICIT_LYRICS_STATUS,
		explicit_content_cover: track.EXPLICIT_TRACK_CONTENT?.EXPLICIT_COVER_STATUS,
		preview: track.MEDIA?.[0]?.HREF,
		gain: +track.GAIN,
		lyrics: track.LYRICS,
		lyrics_id: track.LYRICS_ID,
		genre_id: +track.GENRE_ID,
		digital_release_date: track.DIGITAL_RELEASE_DATE,
		physical_release_date: track.PHYSICAL_RELEASE_DATE,
		artist,
		album,
		filesizes,
		contributors,
		genres: undefined, // not provided
		alternative: undefined, // not provided
		copyright: undefined, // not provided
		fallback_id: undefined, // not provided
		alternative_albums: undefined, // not provided
		position: undefined, // not provided
		size: undefined, // not provided
		song_contributors,
		type: 'track',
	} satisfies EnrichedDeezerTrack;
};
