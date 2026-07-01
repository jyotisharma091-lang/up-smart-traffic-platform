import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

// Nodemon restart trigger

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Disable prefetch as it is not supported for "Transaction" pool mode if Supabase pooler is used
const queryClient = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle(queryClient);
