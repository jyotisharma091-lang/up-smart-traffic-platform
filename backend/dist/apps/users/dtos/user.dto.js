"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum(['STATE_ADMIN', 'DISTRICT_ADMIN', 'TRAFFIC_OFFICER']),
        fullName: zod_1.z.string().min(2, 'Full Name is required'),
        username: zod_1.z.string().min(3, 'Username must be at least 3 characters'),
        email: zod_1.z.string().email('Invalid email').optional(),
        mobileNumber: zod_1.z.string().min(10, 'Mobile Number must be at least 10 digits'),
        pnoNumber: zod_1.z.string().optional(),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        rank: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        policeStation: zod_1.z.string().optional(),
        district: zod_1.z.string().optional(),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['ACTIVE', 'DEACTIVATED', 'RETIRED']).optional(),
        fullName: zod_1.z.string().min(2).optional(),
        mobileNumber: zod_1.z.string().min(10).optional(),
        rank: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        policeStation: zod_1.z.string().optional(),
        district: zod_1.z.string().optional(),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters'),
    }),
});
