import { DeezerCore } from 'deezer';
import { DownloadableObject, generateDownloadableObjects, Single } from '@/downloadable-objects';
import { parseLink } from '@/utils';

describe('Testing the generateDownloadableObjects function', () => {
	let deezer: DeezerCore;
	const trackLink =
		'https://www.deezer.com/mx/track/1380101222?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-1380101222&deferredFl=1&universal_link=1'; // Life goes on

	beforeAll(async () => {
		deezer = new DeezerCore();
		await deezer.loginViaArl(process.env.VITE_DEEZER_ARL_TOKEN || '');
	});

	test('Should parse track ID correctly', () => {
		const [link, linkType, linkId] = parseLink(trackLink);

		expect(link).toBe('https://www.deezer.com/mx/track/1380101222');
		expect(linkId).toBe('1380101222');
		expect(linkType).toBe('track');
	});

	test('Should generate a downloadable track', async () => {
		// 1. Track link
		const track = await generateDownloadableObjects(deezer, trackLink, 3);
		expect(track).toBeDefined();
		expect(track).toBeInstanceOf(DownloadableObject);
		expect(track).toBeInstanceOf(Single);
	});
});
