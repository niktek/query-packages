import {
	sqliteTable,
	text,
	integer,
	primaryKey,
	unique,
} from 'drizzle-orm/sqlite-core';

export const packages = sqliteTable(
	'packages',
	{
		package_id: integer('package_id'),
		name: text('name').unique().notNull(),
		scope: text('scope'),
		version: text('version'),
		author: integer('author').references(() => users.user_id),
		publisher: integer('publisher').references(() => users.user_id),
		description: text('description'),
		date: text('date'),
		npm_url: text('npm_url'),
		homepage_url: text('homepage_url'),
		repository_url: text('repository_url'),
		bugs_url: text('bugs_url'),
		score_quality: integer('score_quality'),
		score_popularity: integer('score_popularity'),
		score_maintenance: integer('score_maintenance'),
		score_search: integer('score_search'),
		score_final: integer('score_final'),
	}, (table) => {
		return {
			pk: primaryKey(table.name, table.scope)
		}
	}

);
export type Package = typeof packages.$inferSelect;
export type PackageInsert = typeof packages.$inferInsert;

export const repository = sqliteTable(
	'repository',
	{
		repository_id: integer('repository_id').primaryKey(),
		package_id: integer('package_id').references(() => packages.package_id),
		is_archived: integer('is_archived'),
		is_locked: integer('is_locked'),
		is_template: integer('is_template'),
		license: text('license'),
		forks: integer('forks'),
		stargazers: integer('stargazers'),
		watchers: integer('watchers'),
		open_issues: integer('open_issues'),
		pull_requests: integer('pull_requests')
	}
);

export type RepositorySelect = typeof repository.$inferSelect;
export type RepositoryInsert = typeof repository.$inferInsert;

export const keywords = sqliteTable(
	'keywords',
	{
		keyword_id: integer('keyword_id').primaryKey(),
		keyword: text('keyword').unique().notNull()
	}
);
export type KeywordSelect = typeof keywords.$inferSelect;
export type KeywordInsert = typeof keywords.$inferInsert;

export const users = sqliteTable(
	'users',
	{
		user_id: integer('user_id').primaryKey(),
		name: text('name'),
		email: text('email'),
		url: text('url'),
	},
	(table) => ({
		unq: unique().on(table.name, table.email),
	})
);
export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const package_keywords = sqliteTable(
	'package_keywords',
	{
		package_id: integer('package_id').references(() => packages.package_id),
		keyword_id: integer('keyword_id').references(() => keywords.keyword_id)
	}
);

export type PackageKeywordSelect = typeof package_keywords.$inferSelect;
export type PackageKeywordInsert = typeof package_keywords.$inferInsert;

export const package_maintainers = sqliteTable(
	'package_maintainers',
	{
		package_id: integer('package_id').references(() => packages.package_id),
		maintainer_id: integer('maintainer_id').references(() => users.user_id)
	}
);

export type PackageMaintainerSelect = typeof package_maintainers.$inferSelect;
export type PackageMaintainerInsert = typeof package_maintainers.$inferInsert;