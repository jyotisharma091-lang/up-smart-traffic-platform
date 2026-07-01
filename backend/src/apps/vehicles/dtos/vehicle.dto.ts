import { z } from 'zod';

export const createVehicleSchema = z.object({
  body: z.object({
    vehicleNumber: z.string().min(4, 'Vehicle number must be valid').max(20),
    ownerName: z.string().optional(),
    vehicleType: z.string().optional(),
  }),
});
