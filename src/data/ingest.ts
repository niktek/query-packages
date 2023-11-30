import { db } from './db';
import {
	keywords,
	users,
	packages,
	type KeywordInsert,
	type UserInsert,
	type UserSelect,
	type PackageInsert,
} from './schema/schema';
import { eq, and } from 'drizzle-orm';

const sampleData = [
	{
		package: {
			name: 'svelte',
			scope: 'unscoped',
			version: '4.2.1',
			description: 'Cybernetically enhanced web apps',
			keywords: ['UI', 'framework', 'templates', 'templating'],
			date: '2023-09-20T08:26:15.398Z',
			links: {
				npm: 'https://www.npmjs.com/package/svelte',
				homepage: 'https://svelte.dev',
				repository: 'https://github.com/sveltejs/svelte',
				bugs: 'https://github.com/sveltejs/svelte/issues',
			},
			author: {
				name: 'Rich Harris',
			},
			publisher: {
				username: 'svelte-admin',
				email: 'richard.a.harris+svelte@gmail.com',
			},
			maintainers: [
				{
					username: 'rich_harris',
					email: 'richard.a.harris@gmail.com',
				},
				{
					username: 'conduitry',
					email: 'npm@chor.date',
				},
				{
					username: 'svelte-admin',
					email: 'richard.a.harris+svelte@gmail.com',
				},
			],
		},
		score: {
			final: 0.42587202165389193,
			detail: {
				quality: 0.6135013288753848,
				popularity: 0.3575855894988853,
				maintenance: 0.3333333333333333,
			},
		},
		searchScore: 100000.414,
	},
	{
		package: {
			name: '@testing-library/svelte',
			scope: 'testing-library',
			version: '4.0.3',
			description:
				'Simple and complete Svelte testing utilities that encourage good testing practices.',
			keywords: [
				'testing',
				'svelte',
				'ui',
				'dom',
				'jsdom',
				'unit',
				'integration',
				'functional',
				'end-to-end',
				'e2e',
				'dupe',
			],
			date: '2023-07-02T23:13:55.911Z',
			links: {
				npm: 'https://www.npmjs.com/package/%40testing-library%2Fsvelte',
				homepage:
					'https://github.com/testing-library/svelte-testing-library#readme',
				repository:
					'https://github.com/testing-library/svelte-testing-library',
				bugs: 'https://github.com/testing-library/svelte-testing-library/issues',
			},
			publisher: {
				username: 'testing-library-bot',
				email: 'testinglibraryoss@gmail.com',
			},
			maintainers: [
				{
					username: 'eps1lon',
					email: 'silbermann.sebastian@gmail.com',
				},
				{
					username: 'mdjastrzebski',
					email: 'mdjastrzebski@gmail.com',
				},
				{
					username: 'jdecroock',
					email: 'decroockjovi@gmail.com',
				},
				{
					username: 'testing-library-bot',
					email: 'testinglibraryoss@gmail.com',
				},
				{
					username: 'kentcdodds',
					email: 'me@kentcdodds.com',
				},
				{
					username: 'timdeschryver',
					email: 'timdeschryver@outlook.com',
				},
				{
					username: 'patrickhulce',
					email: 'patrick.hulce@gmail.com',
				},
				{
					username: 'dfcook',
					email: 'dfcook@hotmail.com',
				},
				{
					username: 'gpx',
					email: 'polvara@gmail.com',
				},
				{
					username: 'mpeyper',
					email: 'mpeyper7@gmail.com',
				},
				{
					username: 'mihar-22',
					email: 'rahim.alwer@gmail.com',
				},
				{
					username: 'pago',
					email: 'patrick.gotthardt@trivago.com',
				},
				{
					username: 'cmckinstry',
					email: 'carson.mckinstry@gmail.com',
				},
				{
					username: 'thymikee',
					email: 'thymikee@gmail.com',
				},
				{
					username: 'brrianalexis',
					email: 'brrianalexis.dev@gmail.com',
				},
			],
		},
		score: {
			final: 0.44570263533621285,
			detail: {
				quality: 0.9890425370542462,
				popularity: 0.09238528354844625,
				maintenance: 0.3333000713656653,
			},
		},
		searchScore: 0.0011484185,
	},
	{
		package: {
			name: 'svelte-preprocess',
			scope: 'unscoped',
			version: '5.0.4',
			description:
				'A Svelte preprocessor wrapper with baked-in support for commonly used preprocessors',
			keywords: [
				'svelte',
				'preprocess',
				'less',
				'stylus',
				'sass',
				'scss',
				'pug',
				'coffeescript',
				'dupe',
			],
			date: '2023-05-26T20:51:56.843Z',
			links: {
				npm: 'https://www.npmjs.com/package/svelte-preprocess',
				homepage:
					'https://github.com/sveltejs/svelte-preprocess#readme',
				repository: 'https://github.com/sveltejs/svelte-preprocess',
				bugs: 'https://github.com/sveltejs/svelte-preprocess/issues',
			},
			author: {
				name: 'Christian Kaisermann',
				email: 'christian@kaisermann.me',
				username: 'kaisermann',
			},
			publisher: {
				username: 'dummdidumm',
				email: 'sholthausen@web.de',
			},
			maintainers: [
				{
					username: 'kaisermann',
					email: 'christian@kaisermann.me',
				},
				{
					username: 'dummdidumm',
					email: 'sholthausen@web.de',
				},
			],
		},
		score: {
			final: 0.37221065483404514,
			detail: {
				quality: 0.5544357175057784,
				popularity: 0.25528290055135605,
				maintenance: 0.3329454982552485,
			},
		},
		searchScore: 0.00030673665,
	},
	{
		package: {
			name: '@niktekio/query-packages',
			version: '0.0.4',
			description:
				'Queries stats from npm and github for certain packages',
			private: true,
			main: './dist/index.js',
			module: './dist.mjs',
			types: './dist/index.d.ts',
			scripts: {
				lint: 'tsc',
				dev: 'tsx src/query.ts',
				gen: 'drizzle-kit generate:sqlite --out ./src/data/migrations --schema ./src/data/schema/schema.ts',
				migrate: 'tsx src/data/migrate.ts',
				ingest: 'tsx src/ingest.ts',
				test: 'vitest run',
				build: 'tsup src/*.ts --format cjs,esm --dts',
				ci: 'pnpm lint && pnpm build',
				release: 'pnpm ci && changeset publish',
			},
			keywords: ['dupe'],
			author: 'niktek <nik@niktek.io> (https://niktek.io)',
			license: 'MIT',
			type: 'module',
			devDependencies: {
				'@changesets/cli': '^2.26.0',
				'@octokit/graphql': '^7.0.1',
				'@types/better-sqlite3': '^7.6.5',
				'@types/node': '^18.15.5',
				'@types/pg': '^8.10.2',
				'drizzle-kit': '^0.19.13',
				eslint: '^8.47.0',
				'eslint-config-prettier': '^9.0.0',
				pg: '^8.11.3',
				prettier: '^3.0.1',
				tslib: '^2.5.0',
				tsup: '^7.2.0',
				tsx: '^3.12.7',
				typescript: '^5.0.2',
				vitest: '^0.29.3',
			},
			dependencies: {
				'@libsql/client': '^0.3.5',
				'@orama/orama': '^1.2.3',
				'better-sqlite3': '^8.7.0',
				dotenv: '^16.0.3',
				'drizzle-orm': '^0.28.6',
			},
		},
	},
];

export async function injest(data: any) {
	for (const pkg of data) {
		let curPkg = pkg.package;
		console.log('Processing: ', curPkg?.name);
		// await etlKeywords(curPkg);
		// await etlUsers(curPkg);
		// await etlPackages(curPkg);
		console.log('author:', await etlAuthor(curPkg));
	}
	// console.log(await db.select().from(keywords).all());
	// console.log(await db.select().from(users).all());
}

async function etlKeywords(pkg: any) {
	for (const keyword of pkg.keywords) {
		const keywordInsert: KeywordInsert = {
			keyword: keyword,
		};
		await db.insert(keywords).values(keywordInsert).onConflictDoNothing();
	}
	console.log(db.select().from(keywords).all());
}

async function etlUsers(pkg: any) {
	let user = pkg?.author;
	if (typeof user === 'string') insertUserFromString(user);
	if (typeof user === 'object') insertUserFromObject(user);
	user = pkg?.publisher;
	if (typeof user === 'string') insertUserFromString(user);
	if (typeof user === 'object') insertUserFromObject(user);
	if (pkg?.maintainers) {
		for (const user of pkg.maintainers) {
			if (typeof user === 'object') insertUserFromObject(user);
		}
	}
}

async function etlAuthor(pkg: any) {
	let user = pkg?.author;
	if (typeof user === 'string') return insertUserFromString(user);
	if (typeof user === 'object') return insertUserFromObject(user);
}

async function insertUserFromString(user: String) {
	const extractUser =
		/^([\w\s]+)(?:\s*<([\w@.]+)>)?(?:\s*\((http[s]?:\/\/[\w./]+)\))?$/;
	const res = user.match(extractUser);
	if (res) {
		const [, name, email, url] = res;
		const user = {
			name: name,
			email: email,
			url: url,
		}
		return await insertUserFromObject(user);
	}
}

async function insertUserFromObject(user: any) {
	const userSelect = await db.select().from(users).where(and(eq(users.name, user?.name), eq(users.email, user?.email)));
	if (userSelect.length > 0) {
		console.log('user exists');
		return userSelect[0];
	} 
	console.log('user does not exist');
	// none of the properties are guaranteed to be there
	const userInsert: UserInsert = {
		name: user?.name || user?.username,
		email: user?.email,
		url: user?.url,
	};
	return await db
		.insert(users)
		.values(userInsert)
		.onConflictDoNothing().toSQL();
}

async function etlPackages(pkg: any) {
	const packageInsert: PackageInsert = {
		name: pkg?.name,
		scope: pkg?.scope,
		version: pkg?.version,
		date: pkg?.date,
		description: pkg?.description,
		score_final: pkg?.score?.final,
		score_quality: pkg?.score?.detail?.quality,
		score_popularity: pkg?.score?.detail?.popularity,
		score_maintenance: pkg?.score?.detail?.maintenance,
		score_search: pkg?.searchScore,
		
	};
	await db.insert(packages).values(packageInsert).onConflictDoNothing();
}
await injest(sampleData);
