import { DeezerCore } from '@/deezer-core';

const deezer = new DeezerCore();
const token = process.env.VITE_DEEZER_ARL_TOKEN;

test('Should login via ARL', async () => {
	expect(token).toBeDefined();

	const result = await deezer.loginViaArl(token!);

	expect(result).toBe(true);
	expect(deezer.loggedIn).toBe(true);
});

test('Should find track by ID', async () => {
	const track = await deezer.api.getTrack(1380101222);
	expect(track).toBeDefined();
});
