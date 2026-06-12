import { DeezerApi, DeezerCore, DeezerGW } from './deezer';
const ARL = '70612925e45ee2c68d002efad20bdaf8b26b9b9d8bd6ca334b9daaf544ce9b6690406f1085d1b830e23cc4583e90454d0792431b50c947be2c0525cf62382f6f52aa2b2885e04ef5d8179657a14ee8a671965accf60cd619471653d90d50e4d7';
// const client = new DeezerApi();
// const client = new DeezerGW(ARL);
const deezer = new DeezerCore();

try {
	// console.log('Get artist info: Runallacta');

	// const data = await client.searchTrack('Runallacta');
	// const data = await client.getTrackPageData(1034678592);
	// console.log(data);

	await deezer.loginViaArl(ARL);
} catch (error) {
	console.error('Error fetching data from Deezer API:', error);
}
