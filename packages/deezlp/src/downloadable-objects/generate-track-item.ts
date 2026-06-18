import { DeezerCore, type DeezerTrack } from 'deezer';
import { Single } from './Single';
import { GenerationException, InvalidID } from '@/exceptions';
import { mapGwTrackToDeezer } from '@/utils';

export const generateTrackItem = async (dz: DeezerCore, id: string | number, bitrate: number) => {
	let deezerTrack: DeezerTrack;

	if (String(id).startsWith('isrc') || +id > 0) {
		deezerTrack = await dz.api.getTrack(id).catch((error: any) => {
			throw new GenerationException(`https://deezer.com/track/${id}`, error.message);
		});
	} else {
		const gwTrack = await dz.gw.getTrack(id).catch((error: any) => {
			throw new GenerationException(`https://deezer.com/track/${id}`, error.message);
		});
		deezerTrack = mapGwTrackToDeezer(gwTrack);
	}

	if (!/^-?\d+$/.test(String(id))) throw new InvalidID(`https://deezer.com/track/${id}`);

	let cover: string;
	if (deezerTrack.album.cover_small) {
		cover = deezerTrack.album.cover_small.slice(0, -24) + '/75x75-000000-80-0-0.jpg';
	} else {
		cover = `https://e-cdns-images.dzcdn.net/images/cover/${deezerTrack.md5_image}/75x75-000000-80-0-0.jpg`;
	}

	// delete deezerTrack.track_token;

	return new Single({
		id,
		type: 'track',
		bitrate,
		title: deezerTrack.title,
		artist: deezerTrack.artist.name,
		cover,
		explicit: deezerTrack.explicit_lyrics,
		single: deezerTrack,
	});
};
