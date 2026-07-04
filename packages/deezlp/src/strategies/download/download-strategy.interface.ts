import type { DownloadPayload, DownloadStatus } from '@/entities';

export type UpdateCallback = ({
	progress,
	attempts,
	status,
	message,
}: {
	progress: number;
	attempts: number;
	status: DownloadStatus;
	message: string;
}) => void;

export interface DownloadStrategy<T extends DownloadPayload> {
	execute(payload: T, onUpdate: UpdateCallback, signal?: AbortSignal): Promise<void>;
}
