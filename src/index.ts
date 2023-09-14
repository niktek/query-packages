export type KeywordCount = {
	[key: string]: number;
}

export type Downloads = {
	day: string;
	downloads: string;
}

export type Package = {
	name: string;
	version: string;
	description: string;
	keywords: string;
	date: string;
	quality: number;
	popularity: number;
	maintenance: number;
	downloads?: Downloads[];
	stargazers?: string[];
}

export type Repository = {
	name: string;
	stargazers: {
		login: string;
		starredAt: string;
	}[];
}

export type Star = {
	starredAt: string;
}

export type PageInfo = {
	endCursor: string;
	hasNextPage: boolean;
}

export type StargazersResponse = {
	totalCount: number;
	pageInfo: PageInfo;
	edges: {
		starredAt: string;
		node: {
			login: string;
		};
	}[];
}

export class PackageRegistry {
	[key: string]: Package;
	constructor() {
		this['test'] = {
			name: 'test',
			version: '1.0.0',
			description: '',
			keywords: '',
			quality: 0,
			popularity: 0,
			maintenance: 0,
			downloads: [],
			date: '',
			stargazers: ['foo'],
		};
	}
}
