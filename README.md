# Deezlp

A unofficial monorepo with helpful deezer packages. This project was fully inspired by the original [Deemix](https://github.com/bambanah/deemix) project. Each package was re-written from scratch in TypeScript, leveraging the speed of [Bun](https://bun.sh/) for optimal performance.

## Packages

| Package                               | Description                                  |
| ------------------------------------- | -------------------------------------------- |
| [deezlp](./packages/deezlp/README.md) | A powerful and fast Deezer music downloader. |
| [deezer](./packages/deezer/README.md) | Deezer API wrapper for TypeScript.           |
| [cli](./packages/cli/README.md)       | Download music via CLI.                      |

## Development

I recommend using [Bun](https://bun.sh/) , as it is faster than Node.js and has built-in TypeScript support. You can install Bun by following the instructions on their website.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/aluissp/deezlp.git
```

2. Install dependencies:

```bash
bun install
```

3. Run all tests:

Be aware that some tests must need your Deezer session cookie (arl) to work properly. You can set it as an environment variable:

```bash
# for example:
cd packages/deezlp
cp .env.example .env
```

Then, edit the `.env` file and add your Deezer session cookie (arl) value.

Finally, run the tests:

```bash
bun run test
```
