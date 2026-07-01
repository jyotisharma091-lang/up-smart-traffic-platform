import { db } from './config/db';
import { users } from './config/schema';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Seeding Database with State Admin...');

  const passwordHash = await bcrypt.hash('admin123', 10);

  // Creating a State Admin user
  // State Admin logs in with Email + Password
  const stateAdmin = {
    id: uuidv4(),
    role: 'STATE_ADMIN',
    fullName: 'State Administrator',
    username: 'admin_state',
    email: 'admin@up.police.gov.in',
    mobileNumber: '9999999999',
    passwordHash,
    status: 'ACTIVE',
    isFirstLogin: false, // System created admin can bypass forced change
  };

  try {
    await db.insert(users).values(stateAdmin);
    console.log(`Successfully created State Admin: ${stateAdmin.email} / password: admin123`);
  } catch (e) {
    console.log(`Failed or already exists:`, e);
  }

  console.log('Seeding Complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding Error:', err);
  process.exit(1);
});
