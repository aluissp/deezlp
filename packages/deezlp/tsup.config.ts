import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'], // like: bun build ./src/index.ts
	format: ['esm', 'cjs'],
	dts: {
		// like: tsc -p tsconfig.build.json
		compilerOptions: { composite: false, noUnusedLocals: false, noUnusedParameters: false },
	},
	clean: true, // like: rm -rf dist
	target: 'node24',
	splitting: false, // generate unified output for each entry point
	sourcemap: true, // generate source maps for debugging
	bundle: true, // bundle the source code
	treeshake: true, // remove unused code
	minify: false, // do not minify the output
	noExternal: ['deezer'], // bundle the deezer package
});
