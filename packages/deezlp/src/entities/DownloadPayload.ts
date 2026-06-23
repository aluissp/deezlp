import type { EnrichedDeezerArtist, EnrichedDeezerTrack } from '@/interfaces';

export interface Single {
	id: number;
	type: 'track';
	bitrate: number;
	title: string;
	artist: EnrichedDeezerArtist;
	cover: string;
	explicit: boolean;
	size: number;
	downloaded: number;
	failed: number;
	progress: number;
	errors?: any;
	files?: any;
	extrasPath: string;
	progressNext: number;
	// uuid: string;
	isCanceled: boolean;
	single: EnrichedDeezerTrack;
}

export interface Collection {
	id: number;
	bitrate: number;
	type: 'album' | 'playlist';
	title: string;
	artist: EnrichedDeezerArtist;
	cover: string;
	explicit: boolean;
	size: number;
	downloaded: number;
	failed: number;
	progress: number;
	errors: any;
	files: any;
	extrasPath: string;
	progressNext: number;
	uuid: string;
	isCanceled: boolean;
	tracks: Single[];
}

export type DownloadPayload = Single | Collection;
