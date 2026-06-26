export interface TrackURLData {
	media: Media[];
	errors?: { code: number }[];
}

interface Media {
	media_type: string;
	cipher: Cipher;
	format: string;
	sources: Source[];
	media_version: number;
	filesize: number;
	nbf: number;
	exp: number;
}

interface Cipher {
	type: string;
}

interface Source {
	url: string;
	provider: string;
}
