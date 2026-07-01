require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

async function test() {
  const sql = postgres(process.env.DATABASE_URL);
  const db = drizzle(sql);
  try {
    const officers = await sql`SELECT * FROM users WHERE role = 'TRAFFIC_OFFICER' LIMIT 1`;
    if (officers.length > 0) {
      console.log('Officer ID:', officers[0].identifier, 'Password:', officers[0].password);
    }
  } catch (err) {
    console.error(err);
  } finally {
    sql.end();
  }
}
test();
