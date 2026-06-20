import type { EnrichedDeezerTrack } from '@/interfaces';
import { DownloadableObject } from './DownloadableObject';

export class Single extends DownloadableObject {
	single: EnrichedDeezerTrack;

	constructor({ single, ...rest }: { single: EnrichedDeezerTrack } & Partial<DownloadableObject>) {
		super(rest as DownloadableObject);
		this.single = single;
		this.__type__ = 'Single';
	}

	override toDict() {
		const dict = super.toDict();

		return { ...dict, single: this.single };
	}

	completeTrackProgress() {
		this.progressNext = 100;
	}

	removeTrackProgress() {
		this.progressNext = 0;
	}
}
