drop table if exists package_keywords;
drop table if exists package_maintainers;
drop table if exists packages;
drop table if exists repository;
drop table if exists keywords;
drop table if exists users;
-- Packages
CREATE TABLE packages (
	package_id INTEGER PRIMARY KEY,
	name text unique NOT NULL,
	scope text,
	version text,
	description text,
	created_at timestamp,
	updated_at timestamp,
	npm_url text,
	homepage_url text,
	repository_url text,
	bugs_url text,
	final NUMERIC(20, 15),
	quality NUMERIC(20, 15),
	popularity NUMERIC(20, 15),
	maintenance NUMERIC(20, 15),
	search_score NUMERIC(20, 15)
);
-- Repository Info
CREATE TABLE repository (
	repository_id integer PRIMARY KEY,
	package_id integer REFERENCES packages(package_id),
	is_archived boolean,
	is_locked boolean,
	is_template boolean,
	license text,
	forks integer,
	stargazers integer,
	watchers integer,
	open_issues integer,
	pull_requests integer
);
-- Keywords
CREATE TABLE keywords (
	keyword_id INTEGER PRIMARY KEY,
	keyword text UNIQUE NOT NULL
);
-- Users
CREATE TABLE users (
	user_id INTEGER PRIMARY KEY,
	username text UNIQUE NOT NULL,
	email text UNIQUE
);
-- Package-Keyword Association
CREATE TABLE package_keywords (
	package_id integer REFERENCES packages(package_id),
	keyword_id integer REFERENCES keywords(keyword_id),
	PRIMARY KEY (package_id, keyword_id)
);
-- Package-Maintainers Association
CREATE TABLE package_maintainers (
	package_id integer REFERENCES packages(package_id),
	user_id integer REFERENCES users(user_id),
	PRIMARY KEY (package_id, user_id)
);
-- BEGIN: 1a2b3c4d5e6f
CREATE FUNCTION IF NOT EXISTS upsert_package(
	p_name text,
	p_scope text,
	p_version text,
	p_description text,
	p_npm_url text,
	p_homepage_url text,
	p_repository_url text,
	p_bugs_url text,
	p_final NUMERIC(20, 15),
	p_quality NUMERIC(20, 15),
	p_popularity NUMERIC(20, 15),
	p_maintenance NUMERIC(20, 15),
	p_search_score NUMERIC(20, 15)
) RETURNS VOID AS $$ BEGIN
INSERT INTO packages (
		name,
		scope,
		version,
		description,
		created_at,
		updated_at,
		npm_url,
		homepage_url,
		repository_url,
		bugs_url,
		final,
		quality,
		popularity,
		maintenance,
		search_score
	)
VALUES (
		p_name,
		p_scope,
		p_version,
		p_description,
		datetime('now'),
		datetime('now'),
		p_npm_url,
		p_homepage_url,
		p_repository_url,
		p_bugs_url,
		p_final,
		p_quality,
		p_popularity,
		p_maintenance,
		p_search_score
	) ON CONFLICT (name) DO
UPDATE
SET scope = excluded.scope,
	version = excluded.version,
	description = excluded.description,
	updated_at = datetime('now'),
	npm_url = excluded.npm_url,
	homepage_url = excluded.homepage_url,
	repository_url = excluded.repository_url,
	bugs_url = excluded.bugs_url,
	final = excluded.final,
	quality = excluded.quality,
	popularity = excluded.popularity,
	maintenance = excluded.maintenance,
	search_score = excluded.search_score;
END;
$$;
-- END: 1a2b3c4d5e6f
-- BEGIN: 7f8e9g0h1i2j
CREATE FUNCTION IF NOT EXISTS add_keywords_to_package(p_package_name text, p_keywords text []) RETURNS VOID AS $$
DECLARE v_package_id INTEGER;
v_keyword_id INTEGER;
BEGIN -- Get the package ID
SELECT package_id INTO v_package_id
FROM packages
WHERE name = p_package_name;
-- Loop through the keywords and add them to the package
FOREACH v_keyword IN ARRAY p_keywords LOOP -- Check if the keyword already exists
SELECT keyword_id INTO v_keyword_id
FROM keywords
WHERE keyword = v_keyword;
-- If the keyword doesn't exist, insert it into the keywords table
IF v_keyword_id IS NULL THEN
INSERT INTO keywords (keyword)
VALUES (v_keyword)
RETURNING keyword_id INTO v_keyword_id;
END IF;
-- Add the keyword to the package_keywords table
INSERT INTO package_keywords (package_id, keyword_id)
VALUES (v_package_id, v_keyword_id);
END LOOP;
END;
$$;
-- END: 7f8e9g0h1i2j
-- BEGIN: 4k5l6m7n8o9p
CREATE FUNCTION IF NOT EXISTS add_maintainers_to_package(p_package_name text, p_usernames text []) RETURNS VOID AS $$
DECLARE v_package_id INTEGER;
v_user_id INTEGER;
BEGIN -- Get the package ID
SELECT package_id INTO v_package_id
FROM packages
WHERE name = p_package_name;
-- Loop through the usernames and add them as maintainers for the package
FOREACH v_username IN ARRAY p_usernames LOOP -- Check if the user already exists
SELECT user_id INTO v_user_id
FROM users
WHERE username = v_username;
-- If the user doesn't exist, insert them into the users table
IF v_user_id IS NULL THEN
INSERT INTO users (username)
VALUES (v_username)
RETURNING user_id INTO v_user_id;
END IF;
-- Add the user as a maintainer for the package
INSERT INTO package_maintainers (package_id, user_id)
VALUES (v_package_id, v_user_id);
END LOOP;
END;
$$;
-- END: 4k5l6m7n8o9p