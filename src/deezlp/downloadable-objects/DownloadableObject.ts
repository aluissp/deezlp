interface DownloadableObjectData {
	type: 'track' | 'album' | 'playlist' | 'artist';
	id: string | number;
	bitrate: number;
	title: string;
	artist: any;
	cover: any;
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
	__type__: 'Single' | 'Collection' | 'Convertable';
}

export class DownloadableObject {
	type: 'track' | 'album' | 'playlist' | 'artist';
	id: string | number;
	bitrate: number;
	title: string;
	artist: any;
	cover: any;
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
	__type__: 'Single' | 'Collection' | 'Convertable';

	constructor(data: DownloadableObjectData) {
		this.type = data.type;
		this.id = data.id;
		this.bitrate = data.bitrate;
		this.title = data.title;
		this.artist = data.artist;
		this.cover = data.cover;
		this.explicit = data.explicit;
		this.size = data.size;
		this.downloaded = data.downloaded;
		this.failed = data.failed;
		this.progress = data.progress;
		this.errors = data.errors;
		this.files = data.files;
		this.extrasPath = data.extrasPath;
		this.progressNext = data.progressNext;
		this.uuid = data.uuid;
		this.isCanceled = data.isCanceled;
		this.__type__ = data.__type__;
	}

	toDict() {
		return {
			type: this.type,
			id: this.id,
			bitrate: this.bitrate,
			uuid: this.uuid,
			title: this.title,
			artist: this.artist,
			cover: this.cover,
			explicit: this.explicit,
			size: this.size,
			downloaded: this.downloaded,
			failed: this.failed,
			progress: this.progress,
			errors: this.errors,
			files: this.files,
			extrasPath: this.extrasPath,
			__type__: this.__type__,
		};
	}

	getSlimmedDict() {
		const data: Record<string, any> = this.toDict();
		const propertiesToRemove = ['single', 'collection', 'plugin', 'conversion_data'];

		propertiesToRemove.forEach(prop => {
			if (Object.keys(data).includes(prop)) delete data[prop];
		});

		return data as DownloadableObjectData;
	}

	updateProgress() {
		if (Math.floor(this.progressNext) !== this.progress && Math.floor(this.progressNext) % 2 === 0 && Math.round(this.progressNext) !== 100) {
			this.progress = this.progressNext;
		}
	}
}
