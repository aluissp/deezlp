import { resolveDeezerUrl } from '@/resolvers';
import { describe, expect, test } from 'bun:test';

describe('Testing the url resolver', () => {
	const trackLink =
		'https://www.deezer.com/mx/track/1380101222?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-1380101222&deferredFl=1&universal_link=1'; // Life goes on

	test('Should parse track ID correctly', () => {
		const parsedLink1 = resolveDeezerUrl(trackLink);
		expect(parsedLink1.id).toBe('1380101222');
		expect(parsedLink1.kind).toBe('id');
		expect(parsedLink1.type).toBe('track');

		const parsedLink2 = resolveDeezerUrl('https://www.deezer.com/mx/track/1380101222');
		expect(parsedLink2.id).toBe('1380101222');
		expect(parsedLink2.kind).toBe('id');
		expect(parsedLink2.type).toBe('track');

		const parsedLink3 = resolveDeezerUrl('1380101222');
		expect(parsedLink3.id).toBe('1380101222');
		expect(parsedLink3.kind).toBe('id');
		expect(parsedLink3.type).toBe('track');

		const parsedLink4 = resolveDeezerUrl('isrc:USAT22007153');
		expect(parsedLink4.id).toBe('USAT22007153');
		expect(parsedLink4.kind).toBe('isrc');
		expect(parsedLink4.type).toBe('track');

		const parsedLink5 = resolveDeezerUrl('upc:602557933736');
		expect(parsedLink5.id).toBe('602557933736');
		expect(parsedLink5.kind).toBe('upc');
		expect(parsedLink5.type).toBe('album');
	});
});
