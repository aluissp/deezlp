# deezlp

A powerful and fast Deezer music downloader with full TypeScript support, enriched metadata (ID3 tags), and synchronized lyrics download. This library was fully inspired by the original [Deemix](https://github.com/bambanah/deemix) and it was re-written from scratch in TypeScript, leveraging the speed of [Bun](https://bun.sh/) for optimal performance.

---

## Features

- **Extreme performance** built on top of Bun and TypeScript.
- **Multiple formats:** Download in different audio qualities (bitrates).
- **Automatic tagging (ID3):** Writes metadata, cover art, and lyrics directly into the audio files.
- **Synchronized lyrics:** Support for saving synced lyrics (creates `.lrc` files or embeds them).
- **Dual CJS & ESM:** Fully compatible with projects using `require` (CommonJS) or `import` (ESM).

---

## Installation

Install `deezlp` using your favorite package manager:

```bash
# Using Bun
bun add deezlp

# Using npm
npm install deezlp

# Using pnpm
pnpm add deezlp
```

## How to get your Token (ARL)

To use this library, you need to authenticate using a Deezer session cookie called arl.

1. Log into your account on Deezer from your web browser.

2. Open the developer tools (F12 -> Application or Storage tab).

3. Look for the Cookies section under deezer.com.

4. Copy the value of the cookie named arl.

## Usage

A quick example to start downloading music:

```ts
import { Deezlp } from 'deezlp';

const deezlp = new Deezlp();

// Customize the settings according to your needs
deezlp.setSettings({
	maxBitrate: 3, // Audio quality (e.g., MP3 320kbps / FLAC)
	tagFile: true, // Embed ID3 tags and cover art into the downloaded file
	syncedLyrics: true, // Download synchronized lyrics (.lrc)
	overwriteFile: false, // Avoid overwriting existing files
});

// Log in with your ARL token
const token = 'YOUR_ARL_COOKIE_HERE';
await deezlp.loginViaArl(token);

// Prepare the list of Deezer track links you want to download
const links = [
	'https://www.deezer.com/mx/track/99976952?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-99976952&deferredFl=1&universal_link=1',
	'https://www.deezer.com/mx/track/562774642?host=6864903961&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=track-562774642&deferredFl=1&universal_link=1',
];

const session = deezlp.prepare(links);

// Start the download process!
await session.start();
console.log('Downloads completed successfully!');
```

## Testing

If you clone the repository and want to run the tests, you can do so with the following command:

```sh
git clone https://github.com/aluissp/deezlp.git
cd packages/deezlp
bun run test
```

The `NODE_OPTIONS="--openssl-legacy-provider"` is disabled by default in Node, however, if you run the tests using Bun it will be enabled by default.
This is importan because the `decryptChunk` function uses the legacy Blowfish `bf-cbc` algorithm. Bun has already enabled this algorithm, but Node.js has deprecated it by security reasons, you must use the `NODE_OPTIONS` environment variable to enable it.
