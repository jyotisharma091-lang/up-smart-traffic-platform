"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchVehicleDto = void 0;
const zod_1 = require("zod");
exports.SearchVehicleDto = zod_1.z.object({
    query: zod_1.z.object({
        registration: zod_1.z.string().min(4, "Registration number must be at least 4 characters").max(20, "Registration number too long"),
    }),
});
