import { join } from 'path';
import { tmpdir } from 'os';
import { extensions } from '@/constants';
import { pipeline } from 'stream/promises';
import { USER_AGENT_HEADER, type DeezerTrack } from 'deezer';
import type { EnrichedDeezerTrack, Settings } from '@/interfaces';
import got, { HTTPError, ReadError, TimeoutError, type Got } from 'got';
import { createWriteStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';

export class FileService {
	private api: Got;
	private readonly TEMPDIR: string;

	constructor(private settings: Settings) {
		this.TEMPDIR = join(tmpdir(), 'deezlp-imgs');
		mkdirSync(this.TEMPDIR, { recursive: true });

		this.api = got.extend({
			headers: { 'User-Agent': USER_AGENT_HEADER },
			https: { rejectUnauthorized: false },
			timeout: { request: 5000 },
		});
	}

	saveSyncedLyrics(filepath: string, filename: string, lyrics?: string): void {
		// 1. Check if lyrics exist and if the setting to save synced lyrics is enabled
		if (!lyrics) return;
		if (!this.settings.syncedLyrics) return;

		const writePath = join(filepath, filename + '.lrc');

		if (existsSync(writePath)) return;

		writeFileSync(writePath, lyrics, { encoding: 'utf-8' });
	}

	checkIsAlreadyDownload({ writePath }: { writePath: string }): boolean {
		return existsSync(writePath) && !this.settings.overwriteFile;
	}

	buildWritePath({ filePath, fileName, bitrate }: { filePath: string; fileName: string; bitrate: number }) {
		const extension = extensions[bitrate as keyof typeof extensions];
		mkdirSync(filePath, { recursive: true });
		const writePath = join(filePath, fileName) + extension;

		return { writePath, extension };
	}

	buildArtistAlbumWritePath({ track, artistPath, coverPath }: { track: EnrichedDeezerTrack; artistPath?: string; coverPath?: string }): {
		artistWritePath?: string;
		coverWritePath?: string;
	} {
		const response: { artistWritePath?: string; coverWritePath?: string } = {};

		if (this.settings.saveArtworkArtist && artistPath && track?.artist?.picture_xl) {
			const extension = track.artist.picture_xl.split('.').pop();

			if (extension) response.artistWritePath = join(artistPath, `${this.fixName(track.artist.name)}.${extension}`);
		}

		if (this.settings.saveArtwork && coverPath && track?.album?.cover_xl) {
			const extension = track.album.cover_xl.split('.').pop();

			if (extension) response.coverWritePath = join(coverPath, `${this.fixName(track.album.title)}.${extension}`);
		}

		return response;
	}

	async downloadImage(url: string, writePath: string): Promise<string | undefined> {
		// 1. If exists, return the path
		if (existsSync(writePath)) return writePath;

		// 2. Create a write stream to the specified path
		const downloadStream = this.api.stream(url);
		const fileWriterStream = createWriteStream(writePath);

		try {
			// 3. Download the image and write it to the specified path
			await pipeline(downloadStream, fileWriterStream);
			return writePath;
		} catch (e: any) {
			if (existsSync(writePath)) {
				try {
					unlinkSync(writePath);
				} catch {}
			}

			// 4. Fallback
			if (e instanceof HTTPError) {
				if (!url.includes('images.dzcdn.net')) return;

				const urlBase = url.slice(0, url.lastIndexOf('/') + 1);
				const pictureURL = url.slice(urlBase.length);
				const pictureSize = parseInt(pictureURL.slice(0, pictureURL.indexOf('x')), 10);

				if (pictureSize <= 1200) return;

				const fallbackUrl = urlBase + pictureURL.replace(`${pictureSize}x${pictureSize}`, '1200x1200');
				return this.downloadImage(fallbackUrl, writePath);
			}

			// 5. Manage network errors and retry the download
			const isNetworkError =
				e instanceof ReadError ||
				e instanceof TimeoutError ||
				['ESOCKETTIMEDOUT', 'ERR_STREAM_PREMATURE_CLOSE', 'ETIMEDOUT', 'ECONNRESET'].includes(e.code);

			if (isNetworkError) return this.downloadImage(url, writePath);

			console.trace(e);
			throw e;
		}
	}

	/**
	 *
	 * @param md5 is a md5_image from album.md5_image
	 * @param type is a string that can be 'cover'
	 */
	buildCoverURLAndPath({ md5, type, coverName }: { md5: string; type: 'cover'; coverName: string }) {
		// let format = `jpg-${this.settings.jpegImageQuality}`;
		let format = 'jpg';
		if (this.settings.embeddedArtworkPNG) format = 'png';

		const size = this.settings.embeddedArtworkSize;

		let embeddedCoverURL = `https://e-cdns-images.dzcdn.net/images/${type}/${md5}/${size}x${size}`;

		if (format === 'png') embeddedCoverURL += '-none-100-0-0.png';
		else {
			// JPG
			const quality = this.settings.jpegImageQuality ?? 80;
			embeddedCoverURL += `-000000-${quality}-0-0.jpg`;
		}

		const embeddedCoverPath = join(this.TEMPDIR, `alb_${coverName}_${this.settings.embeddedArtworkSize}.${format}`);

		return { embeddedCoverURL, embeddedCoverPath };
	}

	buildTrackPath(track: EnrichedDeezerTrack | DeezerTrack) {
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

	private generateTrackName(track: EnrichedDeezerTrack | DeezerTrack, filename: string): string {
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
		if (track?.track_position !== undefined)
			filename = filename.replaceAll('%tracknumber%', track.track_position < 10 ? '0' + track.track_position : track.track_position.toString());
		if (track.album && 'nb_tracks' in track.album && track.album.nb_tracks !== undefined) filename = filename.replaceAll('%tracktotal%', track.album.nb_tracks.toString());

		// if (track.album.genre.length) {
		// 	filename = filename.replaceAll('%genre%', this.fixName(track.album.genre[0], c));
		// } else {
		// 	filename = filename.replaceAll('%genre%', 'Unknown');
		// }

		// if (track?.album?.nb_disk) filename = filename.replaceAll('%disctotal%', track.album.nb_disk.toString());
		// filename = filename.replaceAll('%label%', this.fixName(track.album.label, c));
		// filename = filename.replaceAll('%upc%', track.album.barcode);
		// filename = filename.replaceAll('%album_id%', track.album.id);
		if (track?.album && 'nb_disk' in track.album) filename = filename.replaceAll('%discnumber%', String(track.album.nb_disk));
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

	private generateArtistName(track: EnrichedDeezerTrack | DeezerTrack, artistName: string): string {
		const c = this.settings.illegalCharacterReplacer;
		artistName = artistName.replaceAll('%artist%', this.fixName(track.artist.name, c));
		artistName = artistName.replaceAll('%artist_id%', String(track.artist.id));

		artistName = artistName.replaceAll('\\', '/');

		return artistName;
	}

	private generateAlbumName(track: EnrichedDeezerTrack | DeezerTrack, albumName: string): string {
		const c = this.settings.illegalCharacterReplacer;
		albumName = albumName.replaceAll('%album%', this.fixName(track?.album?.title ?? '', c));
		albumName = albumName.replaceAll('%album_id%', String(track?.album?.id));

		albumName = albumName.replaceAll('%artist%', this.fixName(track.artist.name, c));
		albumName = albumName.replaceAll('%artist_id%', String(track.artist.id));

		albumName = albumName.replaceAll('\\', '/');

		return albumName;
	}
}
