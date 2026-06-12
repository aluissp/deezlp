/**
 * A generic interface for the raw data returned by the Deezer GW API.
 */
export interface GWRawData {
	error?: any[];
	payload?: { FALLBACK: any };
	results?: unknown;
}
