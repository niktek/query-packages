INSERT INTO keywords
	(keyword)
VALUES
	('svelte'),
	('skeleton')
ON CONFLICT DO NOTHING
-- bulk insert https://stackoverflow.com/questions/37300997/multi-row-insert-with-pg-promise