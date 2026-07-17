import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/main.ts'],
	format: ['cjs'], // output format: CommonJS
	dts: false, // generate .d.ts files
	clean: true, // like: rm -rf dist
	target: 'node20',
	splitting: false, // generate unified output for each entry point
	sourcemap: false, // generate source maps for debugging
	bundle: true, // bundle the source code
	treeshake: true, // remove unused code
	minify: false, // do not minify the output
	// noExternal: ['deezer', 'deezlp'], // bundle the deezer, deezlp packages
	// @ts-ignore
	noExternal: [id => !id.startsWith('node:') && !id.includes('readline')], // bundle the deezer, deezlp packages
	external: ['readline/promises'],
});
