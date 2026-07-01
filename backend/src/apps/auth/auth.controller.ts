import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { db } from '../../config/db';
import { users } from '../../config/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = req.body;
    
    const result = await AuthService.login(identifier, password);
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id; // From authMiddleware

    const result = await AuthService.changePassword(userId, currentPassword, newPassword);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      token: result.token,
      user: result.user
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Password change failed' });
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);
    if (result.length === 0) throw new Error('User not found');
    const { passwordHash, ...safeUser } = result[0];
    res.status(200).json({ success: true, user: safeUser });
  } catch (error: any) {
    next(error);
  }
};

// State Admin Registration Mock
export const registerStateAdminInit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Generate mock OTP
    const mockOtp = '123456';
    console.log(`[MOCK EMAIL] Sent OTP ${mockOtp} to ${email}`);

    res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (error: any) {
    next(error);
  }
};

export const registerStateAdminVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password, fullName, mobileNumber } = req.body;
    
    if (otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      role: 'STATE_ADMIN',
      fullName,
      username: email.split('@')[0] + Math.floor(Math.random() * 1000), // Auto-generate username
      email,
      mobileNumber,
      passwordHash,
      status: 'ACTIVE',
      isFirstLogin: false, // They just set their password
    };

    await db.insert(users).values(newUser);

    res.status(201).json({ success: true, message: 'State Admin registered successfully. Please login.' });
  } catch (error: any) {
    next(error);
  }
};

// In-memory OTP store for demo
const resetOtps = new Map<string, string>();

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;
    
    // Check if user exists and is an admin
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const user = result[0];
    if (!['STATE_ADMIN', 'DISTRICT_ADMIN', 'TRAFFIC_ADMIN', 'TRAFFIC_OFFICER'].includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Forgot password is not allowed for this role' });
    }

    // Generate mock OTP
    const mockOtp = '123456';
    resetOtps.set(username, mockOtp);
    
    console.log(`[MOCK EMAIL/SMS] Sent OTP ${mockOtp} to admin ${username}`);

    res.status(200).json({ success: true, message: 'OTP sent to your registered email/mobile' });
  } catch (error: any) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, otp, newPassword } = req.body;
    
    const storedOtp = resetOtps.get(username);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ passwordHash }).where(eq(users.username, username));
    
    // Clear OTP
    resetOtps.delete(username);

    res.status(200).json({ success: true, message: 'Password reset successfully. Please login.' });
  } catch (error: any) {
    next(error);
  }
};
