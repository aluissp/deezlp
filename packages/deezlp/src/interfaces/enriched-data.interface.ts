import { TRACK_FORMATS } from 'deezer';
import type { Lyrics } from './lyrics.interface';
import type { DeezerAlbum, DeezerArtist, DeezerContributor, DeezerTrack, GWLyrics, SngContributors } from 'deezer';

export interface EnrichedDeezerArtist extends DeezerArtist {
	role?: string;
}

export interface EnrichedDeezerContributor extends Omit<DeezerContributor, 'radio'> {
	order?: string;
	rank?: number;
}

export interface EnrichedDeezerAlbum extends DeezerAlbum {
	/** The total track of the album */
	nb_tracks?: number;
	nb_disk?: number;
	md5_origin?: string;
	explicit_lyrics?: boolean;
	record_type?: string;
	/** barcode */
	upc?: string;
	label?: string;
	copyright?: string;
	share?: string;
	duration?: number;
	fans?: number;
	explicit_content_lyrics?: number;
	explicit_content_cover?: number;
	rating?: string;
	genre_id?: number;
	genres?: string[];
	artist?: EnrichedDeezerArtist;
	root_artist?: EnrichedDeezerArtist;
	tracks?: EnrichedDeezerTrack[];
	contributors?: EnrichedDeezerContributor[];
	digital_release_date?: string;
	physical_release_date?: string;
	original_release_date?: string;

	/** Used to store the path of the embedded cover image inside the track directory */
	// embeddedCoverPath?: string;
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
	/** This is the main artist of the track */
	artist: EnrichedDeezerArtist;
	/** This contributors are all artists from gw  */
	contributors: EnrichedDeezerContributor[];
	/** Have all collaborators names */
	song_collaborators?: string[];
	/** Have all contributors extracted from gw track */
	song_contributors?: SngContributors;
	/** This value is computed from gain value using `computeReplayGain` function inside `enrichMissingTrackFields` function. */
	replayGain?: string;
	/** Founded media data */
	media?: {
		/** The URL of the media file */
		url: string;
		/** The bitrate of the media file */
		bitrate: number;
		/** The size of the media file */
		size: number;
		/** The format name of the media file */
		formatName: keyof typeof TRACK_FORMATS;
	};
	// urls?: Partial<Record<keyof typeof TRACK_FORMATS, string>>;
}
