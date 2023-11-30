import { join } from 'path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, dataDir } from './db';

migrate(db, { migrationsFolder: join(dataDir, '/migrations') });
