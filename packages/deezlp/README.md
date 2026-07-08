# deezlp

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Testing

You can enable `NODE_OPTIONS="--openssl-legacy-provider"` in the `test` script.

```json
{
	"scripts": {
		"test": "bun --bun vitest run",
		"test:watch": "bun --bun vitest"
	}
}
```

You can change like this to use node:

```json
{
	"scripts": {
		"test": "NODE_OPTIONS='--openssl-legacy-provider'  vitest run",
		"test:watch": "NODE_OPTIONS='--openssl-legacy-provider'  vitest"
	}
}
```

This change is importan because the `decryptChunk` function uses the legacy Blowfish `bf-cbc` algorithm. Bun has already enabled this algorithm, but Node.js has deprecated it by security reasons, you must use the `NODE_OPTIONS` environment variable to enable it.
