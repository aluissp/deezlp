import type { GWTrack } from '@/interfaces';
import type { DeezerTrack } from '@/schemas';

export const RoleID = ['Main', null, null, null, null, 'Featured'];

export const mapGwTrackToDeezer = (track: GWTrack): DeezerTrack => {
	const baseData: Partial<DeezerTrack> = {
		id: +track.SNG_ID,
		readable: true, // not provided
		title: track.SNG_TITLE,
		title_short: track.SNG_TITLE,
		isrc: track.ISRC,
		link: `https://www.deezer.com/track/${track.SNG_ID}`,
		share: `https://www.deezer.com/track/${track.SNG_ID}`,
		duration: +track.DURATION,
		// bpm: null, // not provided
		available_countries: [], // not provided
		contributors: [],
		md5_image: track.ALB_PICTURE,
		artist: {
			id: +track.ART_ID,
			name: track.ART_NAME,
			link: `https://www.deezer.com/artist/${track.ART_ID}`,
			share: `https://www.deezer.com/artist/${track.ART_ID}`,
			picture: `https://www.deezer.com/artist/${track.ART_ID}/image`,
			// radio: null, // not provided
			tracklist: `https://api.deezer.com/artist/${track.ART_ID}/top?limit=50`,
			type: 'artist',
		},
		album: {
			id: +track.ALB_ID,
			title: track.ALB_TITLE,
			link: `https://www.deezer.com/album/${track.ALB_ID}`,
			cover: `https://api.deezer.com/album/${track.ALB_ID}/image`,
			cover_small: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/56x56-000000-80-0-0.jpg`,
			cover_medium: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/250x250-000000-80-0-0.jpg`,
			cover_big: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/500x500-000000-80-0-0.jpg`,
			cover_xl: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/1000x1000-000000-80-0-0.jpg`,
			md5_image: track.ALB_PICTURE,
			release_date: null, // not provided
			tracklist: `https://api.deezer.com/album/${track.ALB_ID}/tracks`,
			type: 'album',
		},
		type: 'track',
		// Extras
		md5_origin: track.MD5_ORIGIN,
		filesizes: {
			default: +track.FILESIZE,
		},
		media_version: track.MEDIA_VERSION,
		track_token: track.TRACK_TOKEN,
		track_token_expire: track.TRACK_TOKEN_EXPIRE,
	};

	if (+track.SNG_ID <= 0)
		return {
			...baseData,
			token: track.TRACK_TOKEN,
			user_id: track.USER_ID,
			filesizes: {
				...baseData.filesizes,
				mp3_misc: track.FILESIZE_MP3_MISC,
			},
		} as DeezerTrack;

	const titleVersion = (track.VERSION || '').trim();
	const titleShort =
		titleVersion && baseData.title_short?.includes(titleVersion) ? baseData.title_short.replace(titleVersion, '').trim() : baseData.title_short;

	const additionalFields: Partial<DeezerTrack> = {
		title_version: titleVersion,
		title_short: titleShort,
		title: `${titleShort} ${titleVersion}`.trim(),
		track_position: +track.TRACK_NUMBER,
		disk_number: +track.DISK_NUMBER,
		rank: +track.RANK,
		release_date: track.PHYSICAL_RELEASE_DATE,
		explicit_lyrics: Boolean(track.EXPLICIT_LYRICS),
		explicit_content_lyrics: track.EXPLICIT_TRACK_CONTENT?.EXPLICIT_LYRICS_STATUS,
		explicit_content_cover: track.EXPLICIT_TRACK_CONTENT?.EXPLICIT_COVER_STATUS,
		preview: track.MEDIA?.[0]?.HREF,
		gain: +track.GAIN,
		lyrics_id: track.LYRICS_ID,
		physical_release_date: track.PHYSICAL_RELEASE_DATE,
		song_contributors: track.SNG_CONTRIBUTORS,
	};

	// if (track.FALLBACK) {
	// 	additionalFields.fallback_id = track.FALLBACK.SNG_ID;
	// }

	if (track.DIGITAL_RELEASE_DATE) {
		additionalFields.digital_release_date = track.DIGITAL_RELEASE_DATE;
	}

	// if (track.GENRE_ID) {
	// 	additionalFields.genre_id = track.GENRE_ID;
	// }

	// if (track.COPYRIGHT) {
	// 	additionalFields.copyright = track.COPYRIGHT;
	// }

	if (track.LYRICS) {
		additionalFields.lyrics = track.LYRICS;
	}

	// if (track.ALBUM_FALLBACK) {
	// 	additionalFields.alternative_albums = track.ALBUM_FALLBACK;
	// }

	const filesizes: Record<string, number | undefined> = {
		...baseData.filesizes,
		aac_64: +track.FILESIZE_AAC_64,
		mp3_64: +track.FILESIZE_MP3_64,
		mp3_128: +track.FILESIZE_MP3_128,
		mp3_256: +track.FILESIZE_MP3_256,
		mp3_320: +track.FILESIZE_MP3_320,
		mp4_ra1: +track.FILESIZE_MP4_RA1,
		mp4_ra2: +track.FILESIZE_MP4_RA2,
		mp4_ra3: +track.FILESIZE_MP4_RA3,
		flac: +track.FILESIZE_FLAC,
	};

	if (track.ARTISTS) {
		const contributors: Contributor[] = track.ARTISTS.map(contributor => ({
			id: +contributor.ART_ID,
			name: contributor.ART_NAME,
			link: `https://www.deezer.com/artist/${contributor.ART_ID}`,
			share: `https://www.deezer.com/artist/${contributor.ART_ID}`,
			picture: `https://www.deezer.com/artist/${contributor.ART_ID}/image`,
			picture_small: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/56x56-000000-80-0-0.jpg`,
			picture_medium: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/250x250-000000-80-0-0.jpg`,
			picture_big: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/500x500-000000-80-0-0.jpg`,
			picture_xl: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/1000x1000-000000-80-0-0.jpg`,
			md5_image: contributor.ART_PICTURE,
			tracklist: `https://api.deezer.com/artist/${contributor.ART_ID}/top?limit=50`,
			type: 'artist',
			role: RoleID[+contributor.ROLE_ID],
			// Extras
			order: contributor.ARTISTS_SONGS_ORDER,
			rank: contributor.RANK,
		}));

		const mainArtist = contributors.find(c => c.id === baseData.artist?.id);
		if (mainArtist && baseData.artist) {
			baseData.artist = {
				...baseData.artist,
				picture_small: mainArtist.picture_small,
				picture_medium: mainArtist.picture_medium,
				picture_big: mainArtist.picture_big,
				picture_xl: mainArtist.picture_xl,
				md5_image: mainArtist.md5_image,
			};
		}

		additionalFields.contributors = contributors;
	}

	return {
		...baseData,
		...additionalFields,
		filesizes,
	} as DeezerTrack;
};
