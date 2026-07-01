import { z } from 'zod';

export const createViolationSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid('Invalid Vehicle ID').optional(),
    vehicleNumber: z.string().optional(),
    violatorMobile: z.string().optional(),
    violationType: z.string().optional(),
    district: z.string().optional(),
    location: z.string().optional(),
    imageBase64: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    timestamp: z.string().datetime().optional(),
    aiConfidenceScore: z.number().min(0).max(100).optional(),
    aiSummary: z.string().optional(),
    evidenceUrl: z.string().url().optional(),
  }),
});

export const updateViolationStatusSchema = z.object({
  body: z.object({
    status: z.enum([
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
    violationType: z.string().optional(),
  }),
});
