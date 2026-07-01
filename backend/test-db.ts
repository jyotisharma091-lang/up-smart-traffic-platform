import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { users } from './src/config/schema';
dotenv.config();

const queryClient = postgres(process.env.DATABASE_URL as string, { prepare: false });
const db = drizzle(queryClient);

async function test() {
  try {
    console.log("Testing duplicate insert...");
    await db.insert(users).values({
      id: 'test-dup',
      role: 'TRAFFIC_OFFICER',
      fullName: 'Test',
      username: '142410167', // already exists
      mobileNumber: 'dup_mob',
      passwordHash: 'hash'
    });
    console.log("Inserted!");
  } catch (err: any) {
    console.log("Error code:", err.code);
    console.log("Error message:", err.message);
    console.log("Cause:", err.cause);
  } finally {
    process.exit(0);
  }
}
test();
