// @ts-ignore
import Metaflac from 'metaflac-js2';
import { format, parseISO } from 'date-fns';
import { TrackNotFound } from '@/exceptions';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { ID3Writer } from 'browser-id3-writer';
import type { TrackExtensions } from '@/constants';
import type { EnrichedDeezerTrack, Tags } from '@/interfaces';

export class TaggerService {
	constructor(private save: Tags) {}

	tagTrack(track: EnrichedDeezerTrack, filePath: string, extension: TrackExtensions): void {
		if (!existsSync(filePath)) throw new TrackNotFound(filePath);

		if (extension === '.mp3') this.tagID3(track, filePath);
		else if (extension === '.flac') this.tagFLAC(track, filePath);
	}

	private tagID3(track: EnrichedDeezerTrack, filePath: string): void {
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
		if (this.save.lyrics && track?.lyrics?.unsync) writer.setFrame('USLT', { description: 'LYRICS', language: 'XXX', lyrics: track.lyrics.unsync });

		// 18. synced lyrics
		if (this.save.syncedLyrics && track?.lyrics?.syncID3 && track?.lyrics?.syncID3?.length > 0) {
			writer.setFrame('SYLT', {
				type: 1,
				text: track.lyrics.syncID3,
				timestampFormat: 2,
			});
		}

		// 19. involved people and composer
		const involvedPeople: [string, string][] = [];
		const involvedPeopleRoles = [
			'author',
			'masteringengineer',
			'executiveproducer',
			'mixingengineer',
			'artist',
			'engineer',
			'mixer',
			'producer',
			'writer',
			'co- producer',
			'music publisher',
		];

		Object.values(track?.song_contributors ?? {}).forEach(([role, names]: [string, string[]]) => {
			if (involvedPeopleRoles.includes(role)) {
				if (role === 'co- producer') role = 'co-producer';

				names.forEach(person => {
					involvedPeople.push([role, person]);
				});
			}

			if (this.save.composer && role === 'composer' && names?.length) writer.setFrame('TCOM', names);
		});

		if (this.save.involvedPeople && involvedPeople.length) writer.setFrame('IPLS', involvedPeople);

		// 20. copyright
		if (this.save.copyright && track?.copyright) writer.setFrame('TCOP', track.copyright);

		// 21. source
		if (this.save.source) {
			writer.setFrame('TXXX', {
				description: 'SOURCE',
				value: 'Deezer',
			});

			writer.setFrame('TXXX', {
				description: 'SOURCEID',
				value: track.id.toString(),
			});
		}

		// 22. cover
		if (this.save.cover && track?.embeddedCoverPath && existsSync(track.embeddedCoverPath)) {
			const coverBuffer = readFileSync(track.embeddedCoverPath);

			if (coverBuffer.length)
				writer.setFrame('APIC', {
					type: 3,
					data: coverBuffer.buffer,
					description: 'cover',
					useUnicodeEncoding: this.save.coverDescriptionUTF8,
				});
		}

		// 23. save the tags to the file
		let taggedSongBuffer = Buffer.from(writer.addTag());

		if (taggedSongBuffer.subarray(-128, -125).toString() === 'TAG') {
			taggedSongBuffer = taggedSongBuffer.subarray(0, -128);
		}

		// 24. write the tagged song buffer to the file
		writeFileSync(filePath, taggedSongBuffer);
	}

	private tagFLAC(track: EnrichedDeezerTrack, filePath: string): void {
		const flac = new Metaflac(filePath);
		flac.removeAllTags();

		// 1. title
		if (track.title) flac.setTag(`TITLE=${track.title}`);

		// 2. artist or artists
		if (track.artist?.name) {
			const contributors = track?.contributors?.map(contributor => `ARTIST=${contributor.name}`) ?? [`ARTIST=${track.artist.name}`];

			if (this.save.multiArtistSeparator === 'default') contributors.forEach(contributor => flac.setTag(contributor));
			else if (this.save.multiArtistSeparator === 'comma') flac.setTag(contributors.join(', '));
			else if (this.save.multiArtistSeparator === 'nothing') flac.setTag(`ARTIST=${track.artist.name}`);

			// 3. tag artists (means all collaborators)
			if (this.save.artists) track.song_collaborators?.forEach(artist => flac.setTag(`ARTISTS=${artist}`));
		}

		// 4. album
		if (track.album?.title) flac.setTag(`ALBUM=${track.album.title}`);

		// 5. album artist
		if (track.album?.artist?.name) flac.setTag(`ALBUMARTIST=${track.album.artist.name}`);

		// 6. save track number and total tracks
		if (track.track_position) flac.setTag(`TRACKNUMBER=${track.track_position}`);
		if (track.album?.nb_tracks && this.save.trackTotal) flac.setTag(`TRACKTOTAL=${track.album.nb_tracks}`);

		// 7. save disc number and total discs
		if (track.disk_number) flac.setTag(`DISCNUMBER=${track.disk_number}`);
		if (track.album?.nb_disk && this.save.discTotal) flac.setTag(`DISCTOTAL=${track.album.nb_disk}`);

		// 8. genre
		if (track.album?.genres?.length) track.album.genres.forEach(genre => flac.setTag(`GENRE=${genre}`));

		// 9. year - date
		// YEAR tag is not suggested as a standard tag
		// Being YEAR already contained in DATE will only use DATE instead
		// Reference: https://www.xiph.org/vorbis/doc/v-comment.html#fieldnames
		if (track.release_date || track.digital_release_date || track.physical_release_date || track.album?.release_date) {
			const releaseDateString = track.release_date ?? track.digital_release_date ?? track.physical_release_date ?? track.album?.release_date;

			if (releaseDateString) {
				const releaseDate = parseISO(releaseDateString);

				flac.setTag(`DATE=${format(releaseDate, 'yyyy-MM-dd')}`);
			}
		}

		// 10. duration
		if (track.duration) flac.setTag(`LENGTH=${track.duration * 1000}`);

		// 11. bpm
		if (track.bpm) flac.setTag(`BPM=${track.bpm}`);

		// 12. label
		if (track?.album?.label) flac.setTag(`PUBLISHER=${track.album.label}`);

		// 13. isrc
		if (track.isrc) flac.setTag(`ISRC=${track.isrc}`);

		// 14. barcode
		if (track?.album?.upc) flac.setTag(`BARCODE=${track.album.upc}`);

		// 15. explicit
		if (track.explicit_lyrics !== undefined) flac.setTag(`ITUNESADVISORY=${track.explicit_lyrics ? '1' : '0'}`);

		// 16. replayGain
		if (track?.replayGain) flac.setTag(`REPLAYGAIN_TRACK_GAIN=${track.replayGain}`);

		// 17. lyrics
		if (this.save.lyrics && track?.lyrics?.unsync) flac.setTag(`LYRICS=${track.lyrics.unsync}`);

		// 18. involved people and composer
		const involvedPeopleRoles = [
			'author',
			'masteringengineer',
			'executiveproducer',
			'mixingengineer',
			'artist',
			'engineer',
			'mixer',
			'producer',
			'writer',
			'co- producer',
			'music publisher',
		];

		Object.values(track?.song_contributors ?? {}).forEach(([role, names]: [string, string[]]) => {
			if (involvedPeopleRoles.includes(role)) {
				if (role === 'co- producer') role = 'co-producer';

				names.forEach(person => {
					flac.setTag(`${role.toUpperCase()}=${person}`);
				});
			}
			if (role === 'musicpublisher' && names?.length) names.forEach(name => flac.setTag(`ORGANIZATION=${name}`));
		});

		// 19. copyright
		if (this.save.copyright && track?.copyright) flac.setTag(`COPYRIGHT=${track.copyright}`);

		// 20. source
		if (this.save.source) {
			flac.setTag(`SOURCE=Deezer`);
			flac.setTag(`SOURCEID=${track.id}`);
		}

		// 21. cover
		if (this.save.cover && track?.embeddedCoverPath && existsSync(track.embeddedCoverPath)) {
			const coverBuffer = readFileSync(track.embeddedCoverPath);

			if (coverBuffer.length) flac.importPicture(coverBuffer);
		}

		// 22. write the tagged song buffer to the file
		flac.save();
	}
}
