import type { TRACK_FORMATS } from 'deezer';

/**
 * Tagging options
 *
 * Helps to determine which tags should be saved in the downloaded files.
 */
export interface Tags {
	// title?: boolean; // not needed, always saved
	// artist?: boolean; // not needed, always saved if exists
	/** Refers to save:
	 * ```ts
	 * // Song artists are all persons involved in the track
	 * writer.setFrame("TXXX", {
	 * 		description: "ARTISTS",
	 * 		value: track.song_collaborators.join(", "),
	 * });
	 * ```
	 */
	artists?: boolean;
	/**
	 * The separator to use when multiple artists are present in the track. Options:
	 * - 'default': ['artist1', 'artist2']
	 * - 'comma': 'artist1, artist2'
	 * - 'nothing': 'artist1' (refers the main artist only, ignoring the rest)
	 * ```ts
	 * // Song contributors are "artists"
	 * // Example:
	 * writer.setFrame("TPE1", track.contributors) // here!
	 * ```
	 */
	multiArtistSeparator?: 'default' | 'comma' | 'nothing';
	// album?: boolean; // not needed, always saved if exists
	/** Whether to save album artwork (cover img) */
	cover?: boolean;
	// trackNumber?: boolean; // not needed, always saved if exists
	/** Whether to save the total number of tracks in the album */
	trackTotal?: boolean; // not needed, always saved if exists
	// discNumber?: boolean; // not needed, always saved if exists
	/** Whether to save the total number of discs in the album */
	discTotal?: boolean; // not needed, always saved if exists
	// albumArtist?: boolean; // not needed, always saved if exists
	// genre?: boolean; // not needed, always saved if exists
	// year?: boolean; // not needed, always saved if exists
	// date?: boolean; // not needed, always saved if exists
	// explicit?: boolean; // not needed, always saved if exists
	// isrc?: boolean; // not needed, always saved if exists
	// length?: boolean; // not needed, always saved if exists
	// barcode?: boolean; // not needed, always saved if exists
	// bpm?: boolean; // not needed, always saved if exists
	// replayGain?: boolean; // not needed, always saved if exists
	// label?: boolean; // not needed, always saved if exists
	/** Whether to save lyrics */
	lyrics?: boolean;
	/** Whether to save synced lyrics */
	syncedLyrics?: boolean;
	/** Whether to save copyright information */
	copyright?: boolean;
	/** Whether to save composer information */
	composer?: boolean;
	/** Whether to save involved people information */
	involvedPeople?: boolean;
	/** Add source information */
	source?: boolean;
	// savePlaylistAsCompilation?: boolean; // not user for now
	// useNullSeparator?: boolean; // disabled, not user for now
	/** Compatibility with ID3v1 (the oldest format) */
	// saveID3v1?: boolean; // not user for now
	// singleAlbumArtist?: boolean;
	/** Write cover description in UTF-8? */
	coverDescriptionUTF8?: boolean;
	/** Whether to save rating information */
	rating?: boolean;
}

/**
 * Settings interface
 *
 * Defines the structure of the settings object used in the application.
 *
 * It includes various options for tagging, file management, and download preferences.
 */
export interface Settings {
	/**
	 * Tagging options
	 *
	 * Helps to determine which tags should be saved in the downloaded files.
	 */
	tags: Tags;
	// executeCommand: string;
	/** The location where downloaded files will be saved */
	downloadLocation: string;

	// padSingleDigit?: boolean; // disabled
	// fallbackISRC?: boolean; // disabled
	// clearQueueOnExit?: boolean; // disabled
	// autoCheckForUpdates?: boolean; // disabled
	// feelingLucky?: boolean; // disabled
	/** The template for the track name */
	tracknameTemplate?: string;
	// albumTracknameTemplate?: string; // disabled
	// playlistTracknameTemplate?: string; // disabled
	// createPlaylistFolder?: boolean; // disabled
	// playlistNameTemplate?: string; // disabled
	/** Whether to create a folder for each artist */
	createArtistFolder?: boolean;
	/** The template for the artist name */
	artistNameTemplate?: string;
	/** Whether to create a folder for each album */
	createAlbumFolder?: boolean;
	/** The template for the album name */
	albumNameTemplate?: string;
	// createCDFolder?: boolean; // disabled
	// createStructurePlaylist?: boolean; // disabled
	/** The maximum number of attempts to download a file */
	maxAttempts: number;
	// createSingleFolder?: boolean; // disabled
	// padTracks?: boolean; // disabled
	// paddingSize?: number; // disabled
	/** The character to replace illegal characters with */
	illegalCharacterReplacer?: string;
	/** The maximum audio quality to download. */
	maxBitrate?: (typeof TRACK_FORMATS)[keyof typeof TRACK_FORMATS];
	// fallbackBitrate?: boolean; // disabled
	// fallbackSearch?: boolean; // disabled
	// logErrors?: boolean; // disabled
	// logSearched?: boolean; // disabled
	/** Used to overwrite existing files (.mp3, .flac, etc.) */
	overwriteFile: boolean;
	/** Used to tag existing files (.mp3, .flac, etc.) */
	tagFile: boolean;
	// createM3U8File?: boolean; // disabled
	// playlistFilenameTemplate?: string; // disabled
	/** Whether to save synced lyrics */
	syncedLyrics?: boolean;
	/** Size of the embedded artwork */
	embeddedArtworkSize?: number;
	/** Whether to use PNG format for embedded artwork */
	embeddedArtworkPNG?: boolean;
	// localArtworkSize?: number; // disabled
	// localArtworkFormat?: string; // disabled
	/** Refers the album cover */
	saveArtwork?: boolean;
	/** Refers the artist cover */
	// coverImageTemplate?: string; // disabled
	/** Save artist cover? */
	saveArtworkArtist?: boolean;
	// artistImageTemplate?: string; // disabled
	/** JPEG image quality, `embeddedArtworkPNG` must be false */
	jpegImageQuality?: number;
	// dateFormat?: string; // not user for now
	// albumVariousArtists?: boolean; // disabled
	// removeAlbumVersion?: boolean; // disabled
	// removeDuplicateArtists?: boolean; // disabled
	// tagsLanguage?: string;
	// featuredToTitle?: string;
	// titleCasing?: string;
	// artistCasing?: string;
}
