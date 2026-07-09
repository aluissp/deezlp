import { format, parseISO } from 'date-fns';
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

		// 2. artist or artists
		if (track.artist?.name) {
			const contributors = track?.contributors?.map(contributor => contributor.name);

			if (this.save.multiArtistSeparator === 'default') {
				writer.setFrame('TPE1', contributors ?? [track.artist.name]);
			} else if (this.save.multiArtistSeparator === 'comma') {
				const artists = contributors?.join(', ') ?? track.artist.name;
				writer.setFrame('TPE1', [artists]);
			} else if (this.save.multiArtistSeparator === 'nothing') {
				writer.setFrame('TPE1', [track.artist.name]);
			}

			// 3. tag artists (means all collaborators)
			if (this.save.artists) {
				writer.setFrame('TXXX', {
					description: 'ARTISTS',
					value: track.song_collaborators?.join(', ') ?? track.artist.name,
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
		if (track.album?.genres?.length) writer.setFrame('TCON', track.album.genres);

		// 9. year - date
		if (track.release_date || track.digital_release_date || track.physical_release_date || track.album?.release_date) {
			const releaseDateString = track.release_date ?? track.digital_release_date ?? track.physical_release_date ?? track.album?.release_date;

			if (releaseDateString) {
				const releaseDate = parseISO(releaseDateString);

				writer.setFrame('TYER', +format(releaseDate, 'yyyy'));

				/**
				 * ID3 standard
				 * The 'Date' frame is a numeric string in the ddMM format.
				 */
				writer.setFrame('TDAT', format(releaseDate, 'ddMM'));
			}
		}

		// 10. duration
		if (track.duration) writer.setFrame('TLEN', track.duration * 1000);

		// 11. bpm
		if (track.bpm) writer.setFrame('TBPM', track.bpm);

		// 12. label
		if (track?.album?.label) writer.setFrame('TPUB', track.album.label);

		// 13. isrc
		if (track.isrc) writer.setFrame('TSRC', track.isrc);

		// 14. barcode
		if (track?.album?.upc) writer.setFrame('TXXX', { description: 'BARCODE', value: track.album.upc });

		// 15. explicit
		if (track.explicit_lyrics !== undefined) writer.setFrame('TXXX', { description: 'ITUNESADVISORY', value: track.explicit_lyrics ? '1' : '0' });

		// 16. replayGain
		if (track?.replayGain) writer.setFrame('TXXX', { description: 'REPLAYGAIN_TRACK_GAIN', value: track.replayGain });

		// 17. lyrics
		if (this.save.lyrics && track?.lyrics) writer.setFrame('USLT', { description: 'LYRICS', language: 'XXX', lyrics: track.lyrics.unsync });

		// 18. synced lyrics
		if (this.save.syncedLyrics && track?.lyrics?.syncID3 && track?.lyrics?.syncID3?.length > 0) {
			writer.setFrame('SYLT', {
				type: 1,
				text: track.lyrics.syncID3,
				timestampFormat: 2,
			});
		}

		// 19. involved people

		const involvedPeople = [];
		Object.keys(track.contributors).forEach(role => {
			if (['author', 'engineer', 'mixer', 'producer', 'writer'].includes(role)) {
				track.contributors[role].forEach(person => {
					involvedPeople.push([role, person]);
				});
			} else if (role === 'composer' && save.composer) {
				writer.setFrame('TCOM', track.contributors.composer);
			}
		});
		if (involvedPeople.length && save.involvedPeople) writer.setFrame('IPLS', involvedPeople);
	}
}
