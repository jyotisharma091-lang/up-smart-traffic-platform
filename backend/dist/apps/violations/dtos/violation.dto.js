"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViolationStatusSchema = exports.createViolationSchema = void 0;
const zod_1 = require("zod");
exports.createViolationSchema = zod_1.z.object({
    body: zod_1.z.object({
        vehicleId: zod_1.z.string().uuid('Invalid Vehicle ID').optional(),
        vehicleNumber: zod_1.z.string().optional(),
        violatorMobile: zod_1.z.string().optional(),
        violationType: zod_1.z.string().optional(),
        district: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        imageBase64: zod_1.z.string().optional(),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        timestamp: zod_1.z.string().datetime().optional(),
        aiConfidenceScore: zod_1.z.number().min(0).max(100).optional(),
        aiSummary: zod_1.z.string().optional(),
        evidenceUrl: zod_1.z.string().url().optional(),
    }),
});
exports.updateViolationStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([
            'SUBMITTED',
            'UNDER_REVIEW',
            'WARNING_ISSUED',
            'VERIFICATION_QUEUE',
            'RECOMMENDED',
            'APPROVED',
            'REJECTED',
            'CHALLAN_RECOMMENDED',
            'CHALLAN_ISSUED',
            'CLOSED',
            'OFFICER_REVIEW',
            'FORWARD_REVIEW',
            'DISMISSED'
        ]),
        violationType: zod_1.z.string().optional(),
    }),
});
