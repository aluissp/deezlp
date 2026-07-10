import type { EnrichedDeezerTrack } from '@/interfaces';
import type { AlbumDownloadPayload } from './AlbumDownloadPayload';

export type DownloadPayload = EnrichedDeezerTrack | AlbumDownloadPayload;
