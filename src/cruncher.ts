import * as fs from 'fs';
import * as path from 'path';

// Read all JSON files in a directory
async function readJsonDirectory(dirPath: string): Promise<any[]> {
	return new Promise((resolve, reject) => {
		fs.readdir(dirPath, (error, filenames) => {
			if (error) {
				reject(error);
				return;
			}

			const jsonFiles = filenames.filter((filename) =>
				filename.endsWith('.json')
			);

			const packages: any[] = [];

			jsonFiles.forEach((filename, index) => {
				console.log(filename)
				fs.readFile(
					path.join(dirPath, filename),
					'utf-8',
					(error, data) => {
						if (error) {
							reject(error);
							return;
						}

						packages.push(JSON.parse(data));

						if (index === jsonFiles.length - 1) {
							resolve(packages);
						}
					}
				);
			});
		});
	});
}

// Create a Set from the keywords array of each package
async function createKeywordsSet(packages: any[]): Promise<Set<string>> {
	const keywordsSet = new Set<string>();
	const keywordCounts = new Map<string, number>();

	packages.forEach((packageItem) => {
		if (packageItem.keywords && Array.isArray(packageItem.keywords)) {
			packageItem.keywords.forEach((keyword: string) => {
				keywordCounts.set(
					keyword,
					(keywordCounts.get(keyword) || 0) + 1
				);
				keywordsSet.add(keyword);
			});
		}
	});
	console.dir(keywordsSet);
	console.dir(keywordCounts);
	return keywordsSet;
}

(async () => {
	try {
		const packages = await readJsonDirectory('../svelte-packages');
		const keywordsSet = await createKeywordsSet(packages);
		console.log(keywordsSet);
	} catch (error) {
		console.error('Error:', error);
	}
})();
