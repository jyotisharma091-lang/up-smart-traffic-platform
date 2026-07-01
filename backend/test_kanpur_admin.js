require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

async function test() {
  const sql = postgres(process.env.DATABASE_URL);
  try {
    const kanpurAdmin = await sql`SELECT id, username, district, role FROM users WHERE username = 'admin_kanpur'`;
    console.log(kanpurAdmin);
  } catch (err) {
    console.error(err);
  } finally {
    sql.end();
  }
}
test();
