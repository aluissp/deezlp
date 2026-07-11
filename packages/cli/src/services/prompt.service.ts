import readline from 'readline/promises';

export class PromptService {
	async askArl(): Promise<string> {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		const arl = await rl.question('Please enter your ARL: ');

		rl.close();

		return arl.trim();
	}
}
