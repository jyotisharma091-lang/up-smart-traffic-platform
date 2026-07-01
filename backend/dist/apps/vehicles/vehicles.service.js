"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../config/schema");
const drizzle_orm_1 = require("drizzle-orm");
class VehicleService {
    static async createVehicle(data) {
        const existing = await db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.vehicleNumber, data.vehicleNumber));
        if (existing.length > 0) {
            throw new Error('Vehicle with this number already exists');
        }
        const result = await db_1.db.insert(schema_1.vehicles).values(data).returning();
        return result[0];
    }
    static async getVehicleByNumber(vehicleNumber) {
        const result = await db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.vehicleNumber, vehicleNumber));
        if (result.length === 0) {
            throw new Error('Vehicle not found');
        }
        const vehicle = result[0];
        // Fetch associated violations
        const history = await db_1.db.select().from(schema_1.violations).where((0, drizzle_orm_1.eq)(schema_1.violations.vehicleId, vehicle.id));
        return {
            ...vehicle,
            history
        };
    }
}
exports.VehicleService = VehicleService;
