import { TRACK_FORMATS } from 'deezer';
import type { Lyrics } from './lyrics.interface';
import type { DeezerAlbum, DeezerArtist, DeezerContributor, DeezerTrack, GWLyrics } from 'deezer';

export interface EnrichedDeezerArtist extends DeezerArtist {
	role?: string;
	nb_fan?: number;
	nb_album?: number;
}

export interface EnrichedDeezerContributor extends Omit<DeezerContributor, 'radio'> {
	order?: string;
	rank?: number;
}

export interface EnrichedDeezerAlbum extends DeezerAlbum {
	nb_tracks?: number;
	nb_disk?: number;
	md5_origin?: string;
	explicit_lyrics?: boolean;
	record_type?: string;
	upc?: string;
	label?: string;
	copyright?: string;
	share?: string;
	duration?: string;
	fans?: number;
	explicit_content_lyrics?: number;
	explicit_content_cover?: number;
	rating?: string;
	genres?: { data?: { name?: string }[] };
	artist?: EnrichedDeezerArtist;
	root_artist?: EnrichedDeezerArtist;
	tracks?: EnrichedDeezerTrack[];
	contributors?: EnrichedDeezerContributor[];
	digital_release_date?: string;
	physical_release_date?: string;
	original_release_date?: string;
	genre_id?: number;
}

export interface EnrichedDeezerTrack extends Omit<DeezerTrack, 'artist' | 'album' | 'contributors'> {
	bitrate?: (typeof TRACK_FORMATS)[keyof typeof TRACK_FORMATS];
	cover?: string;
	unseen: boolean;
	size?: number;
	lyrics_id?: number;
	gwLyrics?: GWLyrics;
	lyrics?: Lyrics;
	position?: number;
	copyright?: string;
	physical_release_date?: string;
	genres?: string[];
	token: string;
	user_id: number;
	md5_origin?: string;
	filesizes?: Record<string, number>;
	media_version?: string;
	track_token_expire?: number;
	fallback_id?: number;
	digital_release_date?: string;
	genre_id?: number;
	alternative?: EnrichedDeezerTrack;
	alternative_albums?: EnrichedDeezerAlbum[];
	album?: EnrichedDeezerAlbum;
	artist: EnrichedDeezerArtist;
	contributors: EnrichedDeezerContributor[];
	/** Only have artist names */
	song_contributors?: string[];
}
