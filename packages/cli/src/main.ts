import { createCli } from './cli';

async function main(): Promise<void> {
	const program = createCli();

	program.parseAsync(process.argv);
}

main().catch(error => {
	console.error(error);

	process.exit(1);
});
