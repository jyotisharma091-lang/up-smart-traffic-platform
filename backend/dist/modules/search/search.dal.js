"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchDal = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class SearchDal {
    /**
     * Find a vehicle by its registration number.
     * @param registration vehicle registration plate
     */
    async findVehicleByRegistration(registration) {
        const result = await db_1.db
            .select()
            .from(schema_1.vehicles)
            .where((0, drizzle_orm_1.eq)(schema_1.vehicles.registration_number, registration))
            .limit(1);
        return result[0] || null;
    }
    /**
     * Get all warnings associated with a vehicle.
     * @param vehicleId the internal database ID of the vehicle
     */
    async getVehicleWarnings(vehicleId) {
        const result = await db_1.db
            .select({
            id: schema_1.warnings.id,
            warningNumber: schema_1.warnings.warning_number,
            issuedAt: schema_1.warnings.issued_at,
            notes: schema_1.warnings.notes,
        })
            .from(schema_1.warnings)
            .where((0, drizzle_orm_1.eq)(schema_1.warnings.vehicle_id, vehicleId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.warnings.issued_at));
        return result;
    }
    /**
     * Get all violations associated with a vehicle.
     * @param vehicleId the internal database ID of the vehicle
     */
    async getVehicleViolations(vehicleId) {
        const result = await db_1.db
            .select({
            id: schema_1.violations.id,
            captured_at: schema_1.violations.captured_at,
            violation_type: schema_1.violations.violation_type,
            status: schema_1.violations.status,
            location_description: schema_1.violations.location_description,
        })
            .from(schema_1.violations)
            .where((0, drizzle_orm_1.eq)(schema_1.violations.vehicle_id, vehicleId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.violations.captured_at));
        return result;
    }
}
exports.SearchDal = SearchDal;
