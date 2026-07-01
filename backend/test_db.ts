import { db } from './src/config/db';
import { users } from './src/config/schema';

async function test() {
  try {
    const res = await db.select().from(users).limit(1);
    console.log("Success:", res);
  } catch (e: any) {
    console.error("DB Error:", e);
    if (e.cause) console.error("Cause:", e.cause);
  }
  process.exit(0);
}
test();
