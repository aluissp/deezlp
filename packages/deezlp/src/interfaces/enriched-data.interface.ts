import type { DeezerAlbum, DeezerArtist, DeezerContributor, DeezerTrack } from 'deezer';

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
	original_release_date?: string;
	genres?: { data?: { name?: string }[] };
	artist?: EnrichedDeezerArtist;
	root_artist?: EnrichedDeezerArtist;
	tracks?: { data?: EnrichedDeezerTrack[] };
	contributors?: EnrichedDeezerContributor[];
}

export interface EnrichedDeezerTrack extends Omit<DeezerTrack, 'artist' | 'album' | 'contributors'> {
	unseen: boolean;
	size?: number;
	lyrics_id?: number;
	lyrics?: string;
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
	alternative_albums?: { data: EnrichedDeezerAlbum[] };
	album?: EnrichedDeezerAlbum;
	artist: EnrichedDeezerArtist;
	contributors: EnrichedDeezerContributor[];
	/** Only have artist names */
	song_contributors?: string[];
}
