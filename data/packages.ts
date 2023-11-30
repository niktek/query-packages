import type { Package, User } from '..';
import { pool, quickQuery } from '../src/data/db';

export async function getAllPackages() {
	return await quickQuery('SELECT * FROM packages', null, null);
}

export async function bulkAddKeywords(keywords: string[]) {
	const values = keywords.map((keyword) => `('${keyword}')`).join(',');
	const text = `INSERT INTO keywords (keyword) VALUES ${values} ON CONFLICT DO NOTHING`;
	return await quickQuery(text, null, null);
}

export async function bulkAddUsers(users: User[]) {
	const values = users
		.map((user) => `('${user.username}', '${user.email}')`)
		.join(',');
	const text = `INSERT INTO users (username, email) VALUES ${values} ON CONFLICT DO NOTHING`;
	return await quickQuery(text, null, null);
}

async function bulkInsertPackages(packages: Package[]): Promise<void> {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		// Insert packages
		const packageInsertText =
			'INSERT INTO packages(name, scope, version, ..., keywords, maintainers) VALUES ($1, $2, $3, ..., $n, $n+1) RETURNING package_id';
		for (let pkg of packages) {
			const res = await client.query(packageInsertText, [
				pkg.name,
				pkg.scope,
				pkg.version,
				pkg.description,
				pkg.createdAt,
				pkg.updatedAt,
				pkg.isArchived,
				pkg.isLocked,
				pkg.isTemplate,
				pkg.quality,
				pkg.popularity,
				pkg.maintenance,
			]);
			const packageId = res.rows[0].package_id;

			// Handle Keywords
			for (let keyword of pkg.keywords) {
				// Insert unique keyword
				const keywordInsertText =
					'INSERT INTO keywords(keyword) VALUES ($1) ON CONFLICT (keyword) DO NOTHING RETURNING keyword_id';
				const keywordRes = await client.query(keywordInsertText, [
					keyword,
				]);

				// Get the keyword_id; if new keyword inserted, use returned id; else, fetch from keywords table
				const keywordId =
					keywordRes.rows.length > 0
						? keywordRes.rows[0].keyword_id
						: (
								await client.query(
									'SELECT keyword_id FROM keywords WHERE keyword = $1',
									[keyword]
								)
						  ).rows[0].keyword_id;

				// Insert package-keyword association
				const pkgKeywordInsertText =
					'INSERT INTO package_keywords(package_id, keyword_id) VALUES ($1, $2)';
				await client.query(pkgKeywordInsertText, [
					packageId,
					keywordId,
				]);
			}

			// Handle Maintainers
			if (pkg?.maintainers != undefined) {
				for (let maintainer of pkg.maintainers) {
					// Insert unique user/maintainer
					const userInsertText =
						'INSERT INTO users(username, email) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING RETURNING user_id';
					const userRes = await client.query(userInsertText, [
						maintainer.username,
						maintainer.email,
					]);

					// Get the user_id; if new user inserted, use returned id; else, fetch from users table
					const userId =
						userRes.rows.length > 0
							? userRes.rows[0].user_id
							: (
									await client.query(
										'SELECT user_id FROM users WHERE username = $1',
										[maintainer.username]
									)
							  ).rows[0].user_id;

					// Insert package-maintainer association
					const pkgMaintainerInsertText =
						'INSERT INTO package_maintainers(package_id, user_id) VALUES ($1, $2)';
					await client.query(pkgMaintainerInsertText, [
						packageId,
						userId,
					]);
				}
			}
		}

		await client.query('COMMIT');
	} catch (e) {
		await client.query('ROLLBACK');
		throw e;
	} finally {
		client.release();
	}
}
