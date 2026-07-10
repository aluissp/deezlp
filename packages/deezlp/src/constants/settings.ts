import type { Settings } from '@/interfaces';
import { getMusicFolder, TRACK_FORMATS } from 'deezer';

/**
 * Should the lib overwrite files?
 */
export const OverwriteOption = {
	/** Yes, overwrite the file */
	OVERWRITE: 'y',
	/** No, don't overwrite the file */
	DONT_OVERWRITE: 'n',
	/* No, and don't check for extensions */
	DONT_CHECK_EXT: 'e',
	/* No, and keep both files */
	KEEP_BOTH: 'b',
	/* Overwrite only the tags */
	ONLY_TAGS: 't',
	/* Overwrite only lower bitrates */
	ONLY_LOWER_BITRATES: 'l',
};

/**
 * What should I do with featured artists?
 */
export const FeaturesOption = {
	/* Do nothing */
	NO_CHANGE: '0',
	/* Remove from track title */
	REMOVE_TITLE: '1',
	/* Remove from track title and album title */
	REMOVE_TITLE_ALBUM: '3',
	/* Move to track title */
	MOVE_TITLE: '2',
};

export const DEFAULT_SETTINGS: Settings = {
	downloadLocation: getMusicFolder(),
	tracknameTemplate: '%artist% - %title%',
	albumTracknameTemplate: '%tracknumber% - %title%',
	playlistTracknameTemplate: '%artist% - %title%',
	createPlaylistFolder: true,
	playlistNameTemplate: '%playlist%',
	createArtistFolder: true,
	artistNameTemplate: '%artist%',
	createAlbumFolder: true,
	albumNameTemplate: '%album%',
	createCDFolder: true,
	createStructurePlaylist: false,
	maxAttempts: 3, // Maximum number of attempts to download a file
	// createSingleFolder: false,
	padTracks: true,
	padSingleDigit: true,
	paddingSize: 0,
	illegalCharacterReplacer: '_',
	queueConcurrency: 10,
	maxBitrate: TRACK_FORMATS.MP3_128,
	feelingLucky: false,
	fallbackBitrate: false,
	fallbackSearch: false,
	fallbackISRC: false,
	logErrors: true,
	logSearched: false,
	overwriteFile: OverwriteOption.DONT_OVERWRITE,
	createM3U8File: false,
	playlistFilenameTemplate: 'playlist',
	syncedLyrics: false,
	embeddedArtworkSize: 800,
	embeddedArtworkPNG: false,
	// localArtworkSize: 1200,
	// localArtworkFormat: 'jpg',
	saveArtwork: true,
	coverImageTemplate: 'cover',
	saveArtworkArtist: true,
	artistImageTemplate: 'folder',
	jpegImageQuality: 90,
	dateFormat: 'Y-M-D',
	albumVariousArtists: true,
	removeAlbumVersion: false,
	removeDuplicateArtists: true,
	featuredToTitle: FeaturesOption.NO_CHANGE,
	titleCasing: 'nothing',
	artistCasing: 'nothing',
	executeCommand: '',
	tags: {
		// title: true,
		// artist: true,
		artists: true,
		// album: true,
		cover: true,
		// trackNumber: true,
		trackTotal: false,
		// discNumber: true,
		discTotal: false,
		// albumArtist: true,
		// genre: true,
		// year: true,
		// date: true,
		// explicit: false,
		// isrc: true,
		// length: true,
		// barcode: true,
		// bpm: true,
		// replayGain: false,
		// label: true,
		lyrics: true,
		syncedLyrics: false,
		copyright: true,
		composer: true,
		involvedPeople: true,
		source: true,
		rating: false,
		// savePlaylistAsCompilation: false,
		useNullSeparator: false,
		// saveID3v1: true,
		multiArtistSeparator: 'default',
		singleAlbumArtist: false,
		coverDescriptionUTF8: false,
	},
};
