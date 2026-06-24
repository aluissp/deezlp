import type { DownloadPayload } from '@/entities';

export type ProgressCallback = (progress: number) => void;

export interface DownloadStrategy<T extends DownloadPayload> {
	execute(payload: T, onProgress: ProgressCallback): Promise<void>;
}
