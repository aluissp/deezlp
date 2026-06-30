import { join } from 'path';
import { tmpdir } from 'os';
import { extensions } from '@/constants';
import { existsSync, mkdirSync } from 'fs';
import type { EnrichedDeezerTrack, Settings } from '@/interfaces';

export class FileService {
	private readonly TEMPDIR: string;

	constructor(private settings: Settings) {
		this.TEMPDIR = join(tmpdir(), 'deezlp-imgs');
		mkdirSync(this.TEMPDIR, { recursive: true });
	}

	checkIsAlreadyDownload({ writePath }: { writePath: string }): boolean {
		return !existsSync(writePath);
	}

	buildWritePath({ filePath, fileName, bitrate }: { filePath: string; fileName: string; bitrate: number }) {
		const extension = extensions[bitrate as keyof typeof extensions];
		mkdirSync(filePath, { recursive: true });
		const writePath = join(filePath, fileName) + extension;

		return writePath;
	}

	/**
	 *
	 * @param md5 is a md5_origin from album.md5_origin
	 */
	buildCoverURLAndPath({ md5, type }: { md5: string; type: 'cover' }) {
		// let format = `jpg-${this.settings.jpegImageQuality}`;
		let format = 'jpg';
		if (this.settings.embeddedArtworkPNG) format = 'png';

		const size = this.settings.embeddedArtworkSize;

		const url = `https://e-cdns-images.dzcdn.net/images/${type}/${md5}/${size}x${size}`;

		if (format === 'png') return url + '-none-100-0-0.png';

		// JPG
		const quality = this.settings.jpegImageQuality ?? 80;
		return url + `-000000-${quality}-0-0.jpg`;
	}

	buildTrackPath(track: EnrichedDeezerTrack) {
		const fileNameTemplate = this.settings.tracknameTemplate ?? '%artist% - %title%';
		let fileName = this.generateTrackName(track, fileNameTemplate);
		let filePath = this.settings.downloadLocation ?? '.';

		let artistPath: string | undefined, coverPath: string | undefined;

		// artist folder
		if (this.settings.createArtistFolder) {
			filePath += `/${this.generateArtistName(track, this.settings.artistNameTemplate ?? '%artist%')}`;
			artistPath = filePath;
		}

		// album folder
		if (this.settings.createAlbumFolder) {
			filePath += `/${this.generateAlbumName(track, this.settings.albumNameTemplate ?? '%album%')}`;
			coverPath = filePath;
		}

		if (fileName.includes('/')) {
			const parts = fileName.split('/');

			fileName = parts.pop() ?? '';
			filePath += `/${parts.join('/')}`;
		}

		return { fileName, filePath, artistPath, coverPath };
	}

	private fixName(txt: string, char = '_') {
		txt = txt + '';
		txt = txt.replace(/[\0/\\:*?"<>|]/g, char);
		return txt.normalize('NFC');
	}

	private generateTrackName(track: EnrichedDeezerTrack, filename: string): string {
		const c = this.settings.illegalCharacterReplacer;

		filename = filename.replaceAll('%title%', this.fixName(track.title, c));
		filename = filename.replaceAll('%artist%', this.fixName(track.artist.name, c));
		// filename = filename.replaceAll('%artists%', this.fixName(track.artists.join(', '), c));
		// filename = filename.replaceAll('%tagsartists%', this.fixName(track.artistsString, c));
		// filename = filename.replaceAll('%allartists%', this.fixName(track.fullArtistsString, c));
		// filename = filename.replaceAll('%mainartists%', this.fixName(track.mainArtistsString, c));
		// if (track.featArtistsString) filename = filename.replaceAll('%featartists%', this.fixName('(' + track.featArtistsString + ')', c));
		// else filename = filename.replaceAll(' %featartists%', '').replaceAll('%featartists%', '');

		// if (track.album) {
		filename = filename.replaceAll('%album%', this.fixName(track?.album?.title ?? '', c));
		// filename = filename.replaceAll('%albumartist%', this.fixName(track.album?.artist?.name, c));
		if (track?.position) filename = filename.replaceAll('%tracknumber%', track.position < 10 ? '0' + track.position : track.position.toString());
		if (track.album?.nb_tracks) filename = filename.replaceAll('%tracktotal%', track.album.nb_tracks.toString());

		// if (track.album.genre.length) {
		// 	filename = filename.replaceAll('%genre%', this.fixName(track.album.genre[0], c));
		// } else {
		// 	filename = filename.replaceAll('%genre%', 'Unknown');
		// }

		// if (track?.album?.nb_disk) filename = filename.replaceAll('%disctotal%', track.album.nb_disk.toString());
		// filename = filename.replaceAll('%label%', this.fixName(track.album.label, c));
		// filename = filename.replaceAll('%upc%', track.album.barcode);
		// filename = filename.replaceAll('%album_id%', track.album.id);
		if (track?.album?.nb_disk) filename = filename.replaceAll('%discnumber%', String(track.album.nb_disk));
		// filename = filename.replaceAll('%year%', String(track.date.year));
		// filename = filename.replaceAll('%date%', track.dateString);
		filename = filename.replaceAll('%bpm%', String(track.bpm));
		filename = filename.replaceAll('%isrc%', track.isrc);

		if (track.explicit_lyrics) {
			filename = filename.replaceAll('%explicit%', '(Explicit)');
		} else {
			filename = filename.replaceAll(' %explicit%', '').replaceAll('%explicit%', '');
		}

		filename = filename.replaceAll('%track_id%', track.id.toString());
		filename = filename.replaceAll('%artist_id%', String(track.artist.id));
		// if (track.playlist) {
		// 	filename = filename.replaceAll('%playlist_id%', track.playlist.playlistID);
		// 	filename = filename.replaceAll('%position%', pad(track.position, track.playlist.trackTotal, settings));
		// } else if (track.album) {
		// 	filename = filename.replaceAll('%playlist_id%', '');
		// 	if (track.album) {
		// 		filename = filename.replaceAll('%position%', pad(track.trackNumber, track.album.trackTotal, settings));
		// 	}
		// }

		filename = filename.replaceAll('\\', '/');
		// return antiDot(fixLongName(filename));
		return filename;
	}

	private generateArtistName(track: EnrichedDeezerTrack, artistName: string): string {
		const c = this.settings.illegalCharacterReplacer;
		artistName = artistName.replaceAll('%artist%', this.fixName(track.artist.name, c));
		artistName = artistName.replaceAll('%artist_id%', String(track.artist.id));

		artistName = artistName.replaceAll('\\', '/');

		return artistName;
	}

	private generateAlbumName(track: EnrichedDeezerTrack, albumName: string): string {
		const c = this.settings.illegalCharacterReplacer;
		albumName = albumName.replaceAll('%album%', this.fixName(track?.album?.label ?? '', c));
		albumName = albumName.replaceAll('%album_id%', String(track?.album?.id));

		albumName = albumName.replaceAll('\\', '/');

		return albumName;
	}
}
