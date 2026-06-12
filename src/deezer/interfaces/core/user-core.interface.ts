export interface UserCore {
	id?: number;
	name?: string;
	picture?: string;
	license_token?: string;
	can_stream_hq?: boolean;
	can_stream_lossless?: boolean;
	country?: string;
	language?: string;
	loved_tracks?: number;
}
