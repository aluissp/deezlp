import { DeezerApiClient } from './deezer';

const client = new DeezerApiClient();

try {
	console.log('Get artist info: Runallacta');

	const data = await client.searchTrack('Runallacta');

	console.log(data);
} catch (error) {
	console.error('Error fetching data from Deezer API:', error);
}
