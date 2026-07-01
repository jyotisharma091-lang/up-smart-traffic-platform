require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

async function test() {
  const sql = postgres(process.env.DATABASE_URL);
  try {
    const kanpurAdmin = await sql`SELECT * FROM users WHERE district = 'Kanpur nagar' LIMIT 1`;
    if (kanpurAdmin.length === 0) {
      const kanpurAdmin2 = await sql`SELECT * FROM users WHERE district = 'kanpur' LIMIT 1`;
      if (kanpurAdmin2.length === 0) {
         console.log('No kanpur admin found');
         const allUsers = await sql`SELECT identifier, district, role FROM users`;
         console.log(allUsers);
         return;
      }
    }
    
    const district = kanpurAdmin[0]?.district || 'kanpur';
    console.log('District:', district);
    
    const dashboardMetrics = await sql`SELECT count(*) FROM violations WHERE status = 'VERIFICATION_QUEUE' AND district = ${district}`;
    console.log('Dashboard metrics:', dashboardMetrics[0].count);
    
    // Test the logic of getViolations (from line 100)
    // .leftJoin(vehicles, eq(violations.vehicleId, vehicles.id))
    const violationsData = await sql`
      SELECT v.id, v.status, v.district, vh.vehicle_number 
      FROM violations v 
      LEFT JOIN vehicles vh ON v.vehicle_id = vh.id 
      WHERE v.district = ${district}
    `;
    console.log('Total violations for district:', violationsData.length);
    console.log('Violations in verification queue:', violationsData.filter(v => v.status === 'VERIFICATION_QUEUE').length);
    
  } catch (err) {
    console.error(err);
  } finally {
    sql.end();
  }
}
test();
