export const sanitizeUrl = (input: string): string => {
	let clean = input.trim();
	// Remove query parameters and trailing slashes
	if (clean.includes('?')) clean = clean.slice(0, clean.indexOf('?'));
	if (clean.includes('&')) clean = clean.slice(0, clean.indexOf('&'));
	if (clean.endsWith('/')) clean = clean.slice(0, -1);

	return clean;
};
