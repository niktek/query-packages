import fs from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

//https://registry.npmjs.org/-/v1/search?text=svelte&from=6400
const BASE_URL = 'https://registry.npmjs.org/-/v1/search?text=svelte&size=250&from=';

async function fetchSveltePackages(from: number, size:number = 250): Promise<string[]> {
	const url = `${BASE_URL}${from}`;
	console.log(`fetching from: ${ from }, size ${size}`)
	const response = await fetch(url);

	if (response.status === 429) {
		// Wait for 2 minutes before retrying the request
		const waitTimeMs = 120 * 1000;
		console.log(`Waiting for ${waitTimeMs / 1000} seconds before retrying...`);
		await new Promise((resolve) => setTimeout(resolve, waitTimeMs));
		return fetchSveltePackages(from, size);
	}

	if (!response.ok) {
		throw new Error(`Error fetching data: ${response.statusText}`);
	}

	const data: any = await response.json();
	const packages = data.objects;
	console.log("total", data.total, "from:", from, "size:", size, "packages found:", packages.length);
	//Get ready for whether next query will be full or not
	from += size;
	if (from == data.total) return packages;
	if (from + size > data.total) {
		size = data.total - from;
	}
	const nextPackages = await fetchSveltePackages(from, size);
	return packages.concat(nextPackages);
}



async function main() {
	try {
		const sveltePackages = await fetchSveltePackages(0);
		await fs.writeFileSync(join(cwd(),'src','packagedata.json'), JSON.stringify(sveltePackages, null, '\t'))
		console.log('Total number of Svelte packages:', sveltePackages.length);
	} catch (error) {
		console.error('Error fetching Svelte packages:', error);
	}
}

main().catch(console.error);