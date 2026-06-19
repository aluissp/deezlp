import { DeezerCore } from 'deezer';
import type { Settings } from './interfaces';

/**
 * Deezlp is the main class that manages the Deezer API interactions and provides methods to access and manipulate data related to tracks, albums, artists, playlists.
 *
 * @author aluissp
 * @version 1.0.0
 * */
export class Deezlp {
	private dz: DeezerCore;
	settings: Settings;

	constructor(urls: string[], settings: Settings) {
		this.dz = new DeezerCore();
		this.settings = settings;
	}
}
