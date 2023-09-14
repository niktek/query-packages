drop table if exists package_keywords;
drop table if exists package_maintainers;
drop table if exists packages;
drop table if exists keywords;
drop table if exists users;

-- Packages
CREATE TABLE packages
(
	package_id SERIAL PRIMARY KEY,
	name text unique NOT NULL,
	scope text,
	version text,
	description text,
	created_at timestamp with time zone,
	updated_at timestamp with time zone,
	is_archived boolean,
	is_locked boolean,
	is_template boolean,
	license text,
	forks integer,
	stargazers integer,
	watchers integer,
	open_issues integer,
	pull_requests integer,
	npm_url VARCHAR(255),
	homepage_url VARCHAR(255),
	repository_url VARCHAR(255),
	bugs_url VARCHAR(255),
	final DECIMAL(20, 15),
	quality DECIMAL(20, 15),
	popularity DECIMAL(20, 15),
	maintenance DECIMAL(20, 15),
	search_score DECIMAL(20, 15),
	keywords text,
	maintainers text
);

-- Keywords
CREATE TABLE keywords (
	keyword_id SERIAL PRIMARY KEY,
	keyword VARCHAR(255) UNIQUE NOT NULL	
);

-- Users
CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(255) UNIQUE NOT NULL,
	email VARCHAR(255) UNIQUE
);

-- Package-Keyword Association
CREATE TABLE package_keywords (
	package_id INT REFERENCES packages(package_id),
	keyword_id INT REFERENCES keywords(keyword_id),
	constraint pk_id PRIMARY KEY (package_id, keyword_id)
);

-- Package-Maintainers Association
CREATE TABLE package_maintainers (
	package_id INT REFERENCES packages(package_id),
	user_id INT REFERENCES users(user_id),
	constraint pm_id PRIMARY KEY(package_id, user_id)
);

