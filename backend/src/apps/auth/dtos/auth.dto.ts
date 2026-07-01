import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3, 'Username or Email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});
