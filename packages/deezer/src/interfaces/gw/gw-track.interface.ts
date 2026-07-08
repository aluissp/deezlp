export interface GWTrack {
	ALB_ID: string;
	ALB_PICTURE: string;
	ALB_TITLE: string;
	ARTISTS: Artist[];
	ART_ID: string;
	ART_NAME: string;
	ARTIST_IS_DUMMY: boolean;
	DIGITAL_RELEASE_DATE: string;
	DISK_NUMBER: string;
	DURATION: string;
	EXPLICIT_LYRICS: string;
	EXPLICIT_TRACK_CONTENT: ExplicitTrackContent;
	GENRE_ID: string;
	HIERARCHICAL_TITLE: string;
	ISRC: string;
	LYRICS_ID: number;
	PHYSICAL_RELEASE_DATE: string;
	PROVIDER_ID: string;
	RANK: string;
	SMARTRADIO: number;
	SNG_CONTRIBUTORS?: SngContributors;
	SNG_ID: string;
	SNG_TITLE: string;
	STATUS: number;
	TRACK_NUMBER: string;
	USER_ID: number;
	VERSION: string;
	MD5_ORIGIN?: string;
	FALLBACK?: { SNG_ID?: string };
	FILESIZE_AAC_64: string;
	FILESIZE_MP3_64: string;
	FILESIZE_MP3_128: string;
	FILESIZE_MP3_256: string;
	FILESIZE_MP3_320: string;
	FILESIZE_MP4_RA1: string;
	FILESIZE_MP4_RA2: string;
	FILESIZE_MP4_RA3: string;
	FILESIZE_FLAC: string;
	FILESIZE: string;
	GAIN: string;
	MEDIA_VERSION: string;
	TRACK_TOKEN: string;
	TRACK_TOKEN_EXPIRE: number;
	MEDIA: Media[];
	RIGHTS: Rights;
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
	SMARTRADIO: number;
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

interface ExplicitTrackContent {
	EXPLICIT_LYRICS_STATUS: number;
	EXPLICIT_COVER_STATUS: number;
}

interface Media {
	TYPE: string;
	HREF: string;
}

interface Rights {
	STREAM_ADS_AVAILABLE: boolean;
	STREAM_ADS: string;
	STREAM_SUB_AVAILABLE: boolean;
	STREAM_SUB: string;
}

export interface SngContributors {
	main_artist?: string[];
	author?: string[];
	composer?: string[];
	masteringengineer?: string[];
	executiveproducer?: string[];
	mixingengineer?: string[];
	artist?: string[];
	engineer?: string[];
	mixer?: string[];
	producer?: string[];
	writer?: string[];
	'co- producer'?: string[];
	'music publisher'?: string[];
}
