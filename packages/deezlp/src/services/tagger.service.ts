import { TrackNotFound } from '@/exceptions';
import { existsSync, readFileSync } from 'fs';
import { ID3Writer } from 'browser-id3-writer';
import type { TrackExtensions } from '@/constants';
import type { EnrichedDeezerTrack, Tags } from '@/interfaces';
export class TaggerService {
	constructor(private save: Tags) {}

	tagTrack(track: EnrichedDeezerTrack, filePath: string, extension: TrackExtensions): void {
		if (extension === '.mp3') this.tagID3(track, filePath, extension);
	}

	private tagID3(track: EnrichedDeezerTrack, filePath: string, extension: Extract<TrackExtensions, '.mp3'>): void {
		if (!existsSync(filePath)) throw new TrackNotFound(filePath);

		const songBuffer = readFileSync(filePath);
		const writer = new ID3Writer(songBuffer.buffer);

		// 1. title
		if (track.title) writer.setFrame('TIT2', track.title);

		// 2. artist
		if (track.artist?.name) {
			if (this.save.multiArtistSeparator === 'default') {
				writer.setFrame('TPE1', track.song_contributors ?? [track.artist.name]);
			} else if (this.save.multiArtistSeparator === 'comma') {
				const artists = track.song_contributors?.join(', ') ?? track.artist.name;
				writer.setFrame('TPE1', [artists]);
			} else if (this.save.multiArtistSeparator === 'nothing') {
				writer.setFrame('TPE1', [track.artist.name]);
			}

			// 3. tag artists
			if (this.save.artists) {
				writer.setFrame('TXXX', {
					description: 'ARTISTS',
					value: track.song_contributors?.join(', ') ?? track.artist.name,
				});
			}
		}

		// 4. album
		if (track.album?.title) writer.setFrame('TALB', track.album.title);

		// 5. album artist
		if (track.album?.artist?.name) writer.setFrame('TPE2', track.album.artist.name);

		// 6. save track number and total tracks
		if (track.track_position) {
			let trackNumber = track.track_position.toString();

			if (track.album?.nb_tracks && this.save.trackTotal) trackNumber += `/${track.album.nb_tracks}`;

			writer.setFrame('TRCK', trackNumber);
		}

		// 7. save disc number and total discs
		if (track.disk_number) {
			let discNumber = track.disk_number.toString();

			if (track.album?.nb_disk && this.save.discTotal) discNumber += `/${track.album.nb_disk}`;

			writer.setFrame('TPOS', discNumber);
		}

		// 8. genre
		// if (track.album?.genres?.length) writer.setFrame('TCON', track.album.genres.join(', '));
	}
}
