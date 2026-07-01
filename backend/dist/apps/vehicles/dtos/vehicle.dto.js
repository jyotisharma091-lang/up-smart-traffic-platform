"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVehicleSchema = void 0;
const zod_1 = require("zod");
exports.createVehicleSchema = zod_1.z.object({
    body: zod_1.z.object({
        vehicleNumber: zod_1.z.string().min(4, 'Vehicle number must be valid').max(20),
        ownerName: zod_1.z.string().optional(),
        vehicleType: zod_1.z.string().optional(),
    }),
});
