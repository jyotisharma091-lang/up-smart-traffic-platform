import { db } from '../../config/db';
import { users } from '../../config/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  
  static async createUser(data: any, creatorRole: string, creatorDistrict?: string) {
    // 1. RBAC Checks
    if (creatorRole === 'DISTRICT_ADMIN' && data.role !== 'TRAFFIC_OFFICER') {
      throw new Error('District Admins can only create Traffic Officers');
    }

    if (creatorRole === 'DISTRICT_ADMIN' && data.district !== creatorDistrict) {
      throw new Error('District Admins can only create users in their own district');
    }

    if (creatorRole === 'STATE_ADMIN' && data.role !== 'DISTRICT_ADMIN') {
       // State admin primarily creates District Admins
       // But can technically create anyone if needed. We'll restrict to DISTRICT_ADMIN for this flow
       if (data.role !== 'DISTRICT_ADMIN') {
         throw new Error('State Admins can only create District Admins from this interface');
       }
    }

    // 2. Hash Password
    const passwordHash = await bcrypt.hash(data.password, 10);
    const { password, ...insertData } = data;

    // 3. Insert into DB
    const result = await db.insert(users).values({
      ...insertData,
      id: uuidv4(),
      isFirstLogin: true,
      passwordHash,
    }).returning();

    const { passwordHash: _, ...safeUser } = result[0];
    return safeUser;
  }

  static async getUsers(role: string, district?: string) {
    if (role === 'STATE_ADMIN') {
      return await db.select().from(users);
    } else if (role === 'DISTRICT_ADMIN' && district) {
      return await db.select().from(users).where(eq(users.district, district));
    }
    throw new Error('Unauthorized to fetch users list');
  }

  static async updateUser(id: string, data: any, requesterRole: string, requesterDistrict?: string) {
    // Fetch target user to check permissions
    const targetUserList = await db.select().from(users).where(eq(users.id, id));
    if (targetUserList.length === 0) throw new Error('User not found');
    const targetUser = targetUserList[0];

    if (requesterRole === 'DISTRICT_ADMIN') {
      if (targetUser.district !== requesterDistrict || targetUser.role !== 'TRAFFIC_OFFICER') {
        throw new Error('Unauthorized to update this user');
      }
    }

    const result = await db.update(users).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(users.id, id)).returning();

    const { passwordHash: _, ...safeUser } = result[0];
    return safeUser;
  }

  static async resetPassword(id: string, newPasswordPlain: string, requesterRole: string, requesterDistrict?: string) {
    const targetUserList = await db.select().from(users).where(eq(users.id, id));
    if (targetUserList.length === 0) throw new Error('User not found');
    const targetUser = targetUserList[0];

    if (requesterRole === 'DISTRICT_ADMIN') {
      if (targetUser.district !== requesterDistrict || targetUser.role !== 'TRAFFIC_OFFICER') {
        throw new Error('Unauthorized to reset this user\'s password');
      }
    }

    const passwordHash = await bcrypt.hash(newPasswordPlain, 10);
    // Resetting password by admin forces the user to change it again upon next login
    await db.update(users).set({ passwordHash, isFirstLogin: true, updatedAt: new Date() }).where(eq(users.id, id));
    
    return true;
  }

  static async deleteUser(id: string, requesterRole: string, requesterDistrict?: string) {
    const targetUserList = await db.select().from(users).where(eq(users.id, id));
    if (targetUserList.length === 0) throw new Error('User not found');
    const targetUser = targetUserList[0];

    if (requesterRole === 'DISTRICT_ADMIN') {
      if (targetUser.district !== requesterDistrict || targetUser.role !== 'TRAFFIC_OFFICER') {
        throw new Error('Unauthorized to delete this user');
      }
    }

    await db.delete(users).where(eq(users.id, id));
    return true;
  }
}
