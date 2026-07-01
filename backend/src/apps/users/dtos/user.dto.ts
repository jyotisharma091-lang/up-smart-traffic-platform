import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    role: z.enum(['STATE_ADMIN', 'DISTRICT_ADMIN', 'TRAFFIC_OFFICER']),
    fullName: z.string().min(2, 'Full Name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email').optional(),
    mobileNumber: z.string().min(10, 'Mobile Number must be at least 10 digits'),
    pnoNumber: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rank: z.string().optional(),
    designation: z.string().optional(),
    policeStation: z.string().optional(),
    district: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'DEACTIVATED', 'RETIRED']).optional(),
    fullName: z.string().min(2).optional(),
    mobileNumber: z.string().min(10).optional(),
    pnoNumber: z.string().optional(),
    rank: z.string().optional(),
    designation: z.string().optional(),
    policeStation: z.string().optional(),
    district: z.string().optional(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});
