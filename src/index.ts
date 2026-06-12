import { DeezerApi, DeezerCore, DeezerGW } from './deezer';
const ARL =
	'29ef1f90fb42d3f8a499d55edaf86e1339a02321b68651d480c5c3c11c1a520367b389b3aa104ee1868fb782ca039d4c4aaa41e2c1c4f0e675d2deaf867a943ef1f9fba10234f9e452abf546825aa4a981ecbef0d87e21b8dfad6e14301978dd';
// const client = new DeezerApi();
// const client = new DeezerGW(ARL);
const deezer = new DeezerCore();

try {
	console.log('Get artist info: Runallacta');

	// const data = await client.searchTrack('Runallacta');
	// const data = await client.getTrackPageData(1034678592);
	// console.log(data);

	await deezer.loginViaArl(ARL);
} catch (error) {
	console.error('Error fetching data from Deezer API:', error);
}
