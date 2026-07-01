require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

async function test() {
  const sql = postgres(process.env.DATABASE_URL);
  try {
    const admins = await sql`SELECT id, email, username, mobile_number, pno_number, role, district FROM users WHERE role = 'DISTRICT_ADMIN'`;
    console.log(admins);
  } catch (err) {
    console.error(err);
  } finally {
    sql.end();
  }
}
test();
