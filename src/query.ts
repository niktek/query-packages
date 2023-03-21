import fs from 'node:fs/promises';

//https://registry.npmjs.org/-/v1/search?text=svelte&from=6400
const BASE_URL = 'https://registry.npmjs.org/-/v1/search?text=svelte&from=';

async function fetchSveltePackages(from: number): Promise<string[]> {
	const url = `${BASE_URL}${from}`;
	console.log(`fetching from: ${ from }`)
	const response = await fetch(url);

	if (response.status === 429) {
		// Wait for 2 minutes before retrying the request
		const waitTimeMs = 120 * 1000;
		console.log(
			`Received 429 status. Waiting for ${
				waitTimeMs / 1000
			} seconds before retrying...`
		);

		await new Promise((resolve) => setTimeout(resolve, waitTimeMs));
		return fetchSveltePackages(from);
	}

	if (!response.ok) {
		throw new Error(`Error fetching data: ${response.statusText}`);
	}

	const data: any = await response.json();
	const packages = data.objects;
	await writePackagesToFile(packages)
	if (data.total > from + data.objects.length) {
		const nextPackages = await fetchSveltePackages(
			from + data.objects.length
		);
		return packages.concat(nextPackages);
	}

	return packages;
}

async function writePackagesToFile(packages: any) {
	// Create a directory to store package files
	const directory = 'svelte-packages';
	await fs.mkdir(directory, { recursive: true });

	// Write each package name to a separate file
	const writePromises = packages.map(async (packument: any) => {
		const filePath = `${directory}/${encodeURIComponent(packument.package.name)}.json`;
		await fs.writeFile(filePath,JSON.stringify(packument, null, '\t'),'utf8');
	});

	await Promise.all(writePromises);
}

async function main() {
	try {
		const sveltePackages = await fetchSveltePackages(0);
		console.log('Total number of Svelte packages:', sveltePackages.length);
	} catch (error) {
		console.error('Error fetching Svelte packages:', error);
	}
}

main();
export {};
