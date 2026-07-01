require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

async function test() {
  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);
  try {
    const violations = await sql`SELECT * FROM violations WHERE status = 'OFFICER_REVIEW' LIMIT 1`;
    if (violations.length === 0) {
      console.log('No OFFICER_REVIEW cases found.');
      return;
    }
    const v = violations[0];
    console.log('Found violation:', v.id);

    // Try update
    await sql`UPDATE violations SET status = 'DISMISSED' WHERE id = ${v.id}`;
    console.log('Update successful via SQL directly!');
    
  } catch (err) {
    console.error('SQL Error:', err);
  } finally {
    sql.end();
  }
}
test();
