import { DeezerCore } from '@/deezer-core';

const deezer = new DeezerCore();

test('Should login via ARL', async () => {
	const token = process.env.VITE_DEEZER_ARL_TOKEN;
	console.log({ token });
});
