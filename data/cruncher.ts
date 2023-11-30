import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Downloads, KeywordCount, Package } from '.';
import * as dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getPackageDownloads(packageName: string, retryCount = 0): Promise<Downloads[]> {
	const now = new Date();
	const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
	const url = `https://api.npmjs.org/downloads/range/${lastMonth.toISOString().slice(0, 10)}:${now.toISOString().slice(0, 10)}/${packageName.replace('/', '%2F')}`;
	const response = await fetch(url);
	
	if (response.status === 429 && retryCount < 5) {
		console.log(`Got 429 response for package ${packageName}. Retrying in 5 seconds...`);
		await new Promise(resolve => setTimeout(resolve, 5000));
		return getPackageDownloads(packageName, retryCount + 1);
	}
	
	const data = await response.json();
	console.log(data.downloads);
	
	return data.downloads;
}

async function coerce(pkg: any): Promise<Package> {
	return {
		name: pkg.name,
		version: pkg.version,
		description: pkg.description,
		keywords: pkg.keywords?.join(' ') ?? '',
		date: pkg.date,
		quality: pkg.score?.detail?.quality,
		popularity: pkg.score?.detail?.popularity,
		maintenance: pkg.score?.detail?.maintenance
	};
}
// Create a Set from the keywords array of each package
async function createKeywordsSet(packages: any[]): Promise<KeywordCount> {
	const keywords:KeywordCount = {};
	console.log(packages.length);
	
	packages.forEach((packageItem) => {
		const pkg = packageItem.package
		if (pkg.keywords && Array.isArray(pkg.keywords)) {
			pkg.keywords.forEach((keyword: string) => {
				if (keywords[keyword]) {
					keywords[keyword]++;
				} else {
					keywords[keyword] = 1;
				}
			});
		}
	});
	// console.dir(keywordsSet);
	const sortable = Object.fromEntries(
		Object.entries(keywords).sort(([,a],[,b]) => a-b)
	);
	//console.dir(sortable);
	return keywords;
}

export async function crunch() {
	try {
		const packagestring = await readFile(path.join(__dirname, 'packagedata.json'), 'utf-8')
		const packagesdata = JSON.parse(packagestring)
		const packages = new Map<string, Package>(packagesdata.map((pkg: any) => [pkg.package.name, coerce(pkg.package)]));
		// console.dir(packages.keys());
		console.log('raw packagesdata', packagesdata.length);
		console.log('unique packagedata', packages.size);
		const packs = ['@sveltejs/kit', 'svelte-preprocess','svelte','@skeletonlabs/skeleton']
		//packs.forEach((pkg) => { getPackageDownloads(pkg) })
		createKeywordsSet(packages)
	} catch (error) {
		console.error('Error:', error);
	}
}
crunch()