import { db } from '../../config/db';
import { users } from '../../config/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  
  static generateToken(user: any) {
    return jwt.sign(
      { id: user.id, role: user.role, district: user.district, isFirstLogin: user.isFirstLogin },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );
  }

  static async login(identifier: string, passwordPlain: string) {
    // identifier can be Email (State Admin), CUG Number (District Admin), or PNO Number (Traffic Officer)
    const result = await db.select().from(users).where(
      or(
        eq(users.email, identifier),
        eq(users.mobileNumber, identifier),
        eq(users.pnoNumber, identifier),
        eq(users.username, identifier) // Fallback for the seeded admin_state user
      )
    ).limit(1);

    if (result.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result[0];

    if (user.status !== 'ACTIVE') {
      throw new Error('Account is deactivated or suspended');
    }

    // Verify password
    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT
    const token = this.generateToken(user);
    
    // Return sanitized user
    const { passwordHash, ...safeUser } = user;
    return {
      token,
      user: safeUser
    };
  }

  static async changePassword(userId: string, currentPasswordPlain: string, newPasswordPlain: string) {
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (result.length === 0) throw new Error('User not found');
    const user = result[0];

    const isMatch = await bcrypt.compare(currentPasswordPlain, user.passwordHash);
    if (!isMatch) throw new Error('Incorrect current password');

    const passwordHash = await bcrypt.hash(newPasswordPlain, 10);
    
    await db.update(users).set({ 
      passwordHash, 
      isFirstLogin: false,
      updatedAt: new Date()
    }).where(eq(users.id, userId));

    // Get updated user to return new token
    const updatedUserList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const updatedUser = updatedUserList[0];
    const token = this.generateToken(updatedUser);
    
    const { passwordHash: _, ...safeUser } = updatedUser;

    return {
      token,
      user: safeUser
    };
  }

  // TODO: Add actual OTP logic for State Admin registration in the future
}
