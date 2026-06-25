export interface GwAlbum {
	ALB_ID: string;
	ALB_PICTURE: string;
	EXPLICIT_ALBUM_CONTENT: ExplicitAlbumContent;
	ALB_TITLE: string;
	ART_ID: string;
	ART_NAME: string;
	COPYRIGHT: string;
	DIGITAL_RELEASE_DATE: string;
	GENRE_ID: string;
	LABEL_NAME: string;
	NB_FAN: number;
	NUMBER_DISK: string;
	NUMBER_TRACK: string;
	PHYSICAL_RELEASE_DATE: string;
	ORIGINAL_RELEASE_DATE: string;
	RANK: string;
	RANK_ART: string;
	STATUS: string;
	__TYPE__: string;
}

interface ExplicitAlbumContent {
	EXPLICIT_LYRICS_STATUS: number;
	EXPLICIT_COVER_STATUS: number;
}
