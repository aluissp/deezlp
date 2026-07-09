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

The `NODE_OPTIONS="--openssl-legacy-provider"` is disabled by default in Node, however, if you run the tests using Bun it will be enabled by default.
This is importan because the `decryptChunk` function uses the legacy Blowfish `bf-cbc` algorithm. Bun has already enabled this algorithm, but Node.js has deprecated it by security reasons, you must use the `NODE_OPTIONS` environment variable to enable it.
