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
	cover?: boolean;
	// trackNumber?: boolean; // not needed, always saved if exists
	trackTotal?: boolean; // not needed, always saved if exists
	// discNumber?: boolean; // not needed, always saved if exists
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
	lyrics?: boolean;
	syncedLyrics?: boolean;
	copyright?: boolean;
	composer?: boolean;
	involvedPeople?: boolean;
	source?: boolean;
	savePlaylistAsCompilation?: boolean;
	useNullSeparator?: boolean;
	saveID3v1?: boolean;
	singleAlbumArtist?: boolean;
	coverDescriptionUTF8?: boolean;
	rating?: boolean;
}

export interface Settings {
	tags: Tags;
	executeCommand: string;
	downloadLocation: string;

	padSingleDigit?: boolean;
	fallbackISRC?: boolean;
	clearQueueOnExit?: boolean;
	autoCheckForUpdates?: boolean;
	feelingLucky?: boolean;
	tracknameTemplate?: string;
	albumTracknameTemplate?: string;
	playlistTracknameTemplate?: string;
	createPlaylistFolder?: boolean;
	playlistNameTemplate?: string;
	createArtistFolder?: boolean;
	artistNameTemplate?: string;
	createAlbumFolder?: boolean;
	albumNameTemplate?: string;
	createCDFolder?: boolean;
	createStructurePlaylist?: boolean;
	maxAttempts: number;
	// createSingleFolder?: boolean; // disabled
	padTracks?: boolean;
	paddingSize?: number;
	illegalCharacterReplacer?: string;
	queueConcurrency?: number;
	maxBitrate?: number;
	fallbackBitrate?: boolean;
	fallbackSearch?: boolean;
	logErrors?: boolean;
	logSearched?: boolean;
	saveDownloadQueue?: boolean;
	overwriteFile?: string;
	createM3U8File?: boolean;
	playlistFilenameTemplate?: string;
	syncedLyrics?: boolean;
	/** Size of the embedded artwork */
	embeddedArtworkSize?: number;
	/** Whether to use PNG format for embedded artwork */
	embeddedArtworkPNG?: boolean;
	localArtworkSize?: number;
	localArtworkFormat?: string;
	saveArtwork?: boolean;
	coverImageTemplate?: string;
	saveArtworkArtist?: boolean;
	artistImageTemplate?: string;
	/** JPEG image quality, `embeddedArtworkPNG` must be false */
	jpegImageQuality?: number;
	dateFormat?: string;
	albumVariousArtists?: boolean;
	removeAlbumVersion?: boolean;
	removeDuplicateArtists?: boolean;
	tagsLanguage?: string;
	featuredToTitle?: string;
	titleCasing?: string;
	artistCasing?: string;
}
