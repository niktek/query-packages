export type Downloads = {
	day: string;
	downloads: number;
}

export type Package = {
	name: string;
	scope: string;
	version: string;
	description: string;
	keywords: string[];
	createdAt: Date;
	updatedAt: Date;
	isArchived: boolean;
	isLocked: boolean;
	isTemplate: boolean;
	quality: number;
	popularity: number;
	maintenance: number;
	downloads?: Downloads[];
	stargazers?: string[];
	maintainers?: User[];
};

export type User = {
	username: string;
	email: string;
}

export class PackageRegistry {
	[key: string]: Package;
	constructor() {
		this['test'] = {
			name: 'test',
			scope: '',
			version: '0.0.1',
			description: 'This is the description',
			keywords: ['keyword'],
			quality: 0,
			popularity: 0,
			maintenance: 0,
			downloads: [],
			createdAt: new Date(),
			updatedAt: new Date(),
			isArchived: false,
			isLocked: false,
			isTemplate: false
		};
	}
}
