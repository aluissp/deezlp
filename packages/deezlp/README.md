# deezlp

A powerful and fast Deezer music downloader with full TypeScript support, enriched metadata (ID3 tags), and synchronized lyrics download. This library was fully inspired by the original [Deemix](https://github.com/bambanah/deemix) and it was re-written from scratch in TypeScript, leveraging the speed of [Bun](https://bun.sh/) for optimal performance.

---

## Table of Contents

- [deezlp](#deezlp)
	- [Table of Contents](#table-of-contents)
	- [Features](#features)
	- [Installation](#installation)
	- [How to get your Token (ARL)](#how-to-get-your-token-arl)
	- [Usage](#usage)
	- [Settings](#settings)
	- [Limitations](#limitations)
	- [Running Tests](#running-tests)

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
import { Deezlp, AUDIO_QUALITIES } from 'deezlp';

const deezlp = new Deezlp();

// Customize the settings according to your needs
deezlp.setSettings({
	maxBitrate: AUDIO_QUALITIES.MP3_128, // Audio quality (e.g., MP3 128kbps, 320kbps / FLAC)
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

## Settings

You can override the default settings by calling the `setSettings` method. The available settings are:

| Setting                    | Type              | Default                    | Description                                                 |
| -------------------------- | ----------------- | -------------------------- | ----------------------------------------------------------- |
| `downloadLocation`         | `string`          | Your default Music folder. | The location where downloaded files will be saved.          |
| `maxBitrate`               | `AUDIO_QUALITIES` | `AUDIO_QUALITIES.MP3_128`  | The maximum audio quality to download.                      |
| `tracknameTemplate`        | `string`          | %artist% - %title%         | The template for the track name.                            |
| `artistNameTemplate`       | `string`          | %artist%                   | The template for the artist name.                           |
| `albumNameTemplate`        | `string`          | %album%                    | The template for the album name.                            |
| `createArtistFolder`       | `boolean`         | true                       | Whether to create a folder for each artist.                 |
| `createAlbumFolder`        | `boolean`         | true                       | Whether to create a folder for each album.                  |
| `maxAttempts`              | `number`          | 3                          | The maximum number of attempts to download a file.          |
| `illegalCharacterReplacer` | `string`          | '\_'                       | The character to replace illegal characters with.           |
| `overwriteFile`            | `boolean`         | false                      | Whether to overwrite existing files.                        |
| `tagFile`                  | `boolean`         | true                       | Whether to tag downloaded file.                             |
| `syncedLyrics`             | `boolean`         | true                       | Whether to save synced lyrics.                              |
| `embeddedArtworkSize`      | `number`          | 800                        | Size of the embedded artwork (cover img).                   |
| `embeddedArtworkPNG`       | `boolean`         | false                      | Whether to use PNG format for embedded artwork (cover img). |
| `saveArtwork`              | `boolean`         | true                       | Whether to save album artwork (cover img).                  |
| `saveArtworkArtist`        | `boolean`         | true                       | Whether to save artist artwork (cover img).                 |
| `jpegImageQuality`         | `number`          | 90                         | JPEG image quality, `embeddedArtworkPNG` must be false.     |
| `tags`                     | `Tags`            |                            | Tagging options.                                            |

Here's the default `Tags` settings:

| Tags                   | Type                           | Default | Description                                              |
| ---------------------- | ------------------------------ | ------- | -------------------------------------------------------- |
| `artist`               | `boolean`                      | true    | Tag all artists (collaborators).                         |
| `multiArtistSeparator` | 'default', 'comma' , 'nothing' | default | Indicates how to separate multiple artists.              |
| `cover`                | `boolean`                      | true    | Whether to save album artwork (cover img).               |
| `trackTotal`           | `boolean`                      | false   | Whether to save the total number of tracks in the album. |
| `discTotal`            | `boolean`                      | false   | Whether to save the total number of discs in the album.  |
| `lyrics`               | `boolean`                      | true    | Whether to save unsync lyrics.                           |
| `syncedLyrics`         | `boolean`                      | false   | Whether to save synced lyrics.                           |
| `copyright`            | `boolean`                      | true    | Whether to save copyright information.                   |
| `composer`             | `boolean`                      | true    | Whether to save composer information.                    |
| `involvedPeople`       | `boolean`                      | true    | Whether to save involved people information.             |
| `source`               | `boolean`                      | true    | Whether to save source information.                      |
| `coverDescriptionUTF8` | `boolean`                      | false   | Whether to write cover description in UTF-8.             |
| `rating`               | `boolean`                      | false   | Whether to save rating information.                      |

## Limitations

- The `deezlp` library is designed to be used in **Node.js** or **Bun** environments. It may not work in browser environments.
- Fow now, the library **does not support** downloading **playlists**, **artists** or **podcasts** links.

## Running Tests

If you clone the repository and want to run the tests, you can do so with the following command:

```sh
git clone https://github.com/aluissp/deezlp.git
cd packages/deezlp
bun run test
```

The `NODE_OPTIONS="--openssl-legacy-provider"` is disabled by default in Node, however, if you run the tests using Bun it will be enabled by default.
This is importan because the `decryptChunk` function uses the legacy Blowfish `bf-cbc` algorithm. Bun has already enabled this algorithm, but Node.js has deprecated it by security reasons, you must use the `NODE_OPTIONS` environment variable to enable it.
