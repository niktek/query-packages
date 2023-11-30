import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import postgres from 'postgres';
console.log(dotenv.config({ path: '../../.env' }));
console.log(process.env);

export const dataDir = fileURLToPath(new URL('.', import.meta.url));


const client = postgres(`postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:5432/${process.env.PGDATABASE}`)
export const db: PostgresJsDatabase = drizzle(client);