import type { GWLyrics } from './gw-lyrics.interface';

export interface GWTrackPage {
	DATA: Data;
	LYRICS: GWLyrics;
	ISRC: Isrc;
	RELATED_ALBUMS: Isrc;
}

interface Data {
	SNG_ID: string;
	PRODUCT_TRACK_ID: string;
	UPLOAD_ID: number;
	SNG_TITLE: string;
	ART_ID: string;
	PROVIDER_ID: string;
	ART_NAME: string;
	ARTIST_IS_DUMMY: boolean;
	ARTISTS: Artist[];
	ALB_ID: string;
	ALB_TITLE: string;
	TYPE: number;
	MD5_ORIGIN: string;
	VIDEO: boolean;
	DURATION: string;
	ALB_PICTURE: string;
	ART_PICTURE: string;
	RANK_SNG: string;
	FILESIZE_AAC_64: string;
	FILESIZE_MP3_64: string;
	FILESIZE_MP3_128: string;
	FILESIZE_MP3_256: string;
	FILESIZE_MP3_320: string;
	FILESIZE_MP4_RA1: string;
	FILESIZE_MP4_RA2: string;
	FILESIZE_MP4_RA3: string;
	FILESIZE_MHM1_RA1: string;
	FILESIZE_MHM1_RA2: string;
	FILESIZE_MHM1_RA3: string;
	FILESIZE_FLAC: string;
	FILESIZE: string;
	GAIN: string;
	MEDIA_VERSION: string;
	DISK_NUMBER: string;
	TRACK_NUMBER: string;
	TRACK_TOKEN: string;
	TRACK_TOKEN_EXPIRE: number;
	VERSION: string;
	MEDIA: Media[];
	EXPLICIT_LYRICS: string;
	RIGHTS: Rights;
	ISRC: string;
	HIERARCHICAL_TITLE: string;
	SNG_CONTRIBUTORS: SngContributors;
	LYRICS_ID: number;
	EXPLICIT_TRACK_CONTENT: ExplicitTrackContent;
	COPYRIGHT: string;
	PHYSICAL_RELEASE_DATE: string;
	S_MOD: number;
	S_PREMIUM: number;
	DATE_START_PREMIUM: string;
	DATE_START: string;
	STATUS: number;
	USER_ID: number;
	URL_REWRITING: string;
	SNG_STATUS: string;
	AVAILABLE_COUNTRIES: AvailableCountries;
	UPDATE_DATE: string;
	__TYPE__: string;
}

interface Artist {
	ART_ID: string;
	ROLE_ID: string;
	ARTISTS_SONGS_ORDER: string;
	ART_NAME: string;
	ARTIST_IS_DUMMY: boolean;
	ART_PICTURE: string;
	RANK: string;
	LOCALES: Locales;
	__TYPE__: string;
}

interface Locales {
	lang_en: Lang;
	'lang_ja-hrkt': Lang;
	lang_fr: Lang;
	'lang_ja-kana': Lang;
}

interface Lang {
	name: string;
}

interface AvailableCountries {
	STREAM_ADS: string[];
	STREAM_SUB_ONLY: any[];
}

interface ExplicitTrackContent {
	EXPLICIT_LYRICS_STATUS: number;
	EXPLICIT_COVER_STATUS: number;
}

interface Media {
	TYPE: string;
	HREF: string;
}

interface Rights {
	STREAM_ADS_AVAILABLE?: boolean;
	STREAM_ADS?: string;
	STREAM_SUB_AVAILABLE?: boolean;
	STREAM_SUB?: string;
}

interface SngContributors {
	main_artist: string[];
	author: string[];
}

interface Isrc {
	data: Datum[];
	count: number;
	total: number;
}

interface Datum {
	ART_NAME: string;
	ART_ID: string;
	ALB_PICTURE: string;
	ALB_ID: string;
	ALB_TITLE: string;
	DURATION: string;
	DIGITAL_RELEASE_DATE: string;
	RIGHTS: Rights;
	LYRICS_ID: number;
	__TYPE__: 'Album';
}
