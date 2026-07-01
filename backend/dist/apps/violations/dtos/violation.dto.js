"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViolationStatusSchema = exports.createViolationSchema = void 0;
const zod_1 = require("zod");
exports.createViolationSchema = zod_1.z.object({
    body: zod_1.z.object({
        vehicleId: zod_1.z.string().uuid('Invalid Vehicle ID'),
        violationType: zod_1.z.string().min(2, 'Violation type required'),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        timestamp: zod_1.z.string().datetime().optional(), // ISO string
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
            'CLOSED'
        ]),
    }),
});
