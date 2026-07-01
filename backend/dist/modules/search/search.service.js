"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const search_dal_1 = require("./search.dal");
class SearchService {
    searchDal;
    constructor() {
        this.searchDal = new search_dal_1.SearchDal();
    }
    /**
     * Fetch full vehicle history including warnings and violations
     * @param registration Vehicle registration number
     * @param isDemo Whether the system is currently in Demo mode
     */
    async getVehicleHistory(registration, isDemo) {
        if (isDemo) {
            // Return synthetic demo data if in demo mode
            return this.getDemoData(registration);
        }
        // Production mode data fetch
        const vehicle = await this.searchDal.findVehicleByRegistration(registration);
        if (!vehicle) {
            return null;
        }
        const warnings = await this.searchDal.getVehicleWarnings(vehicle.id);
        const violations = await this.searchDal.getVehicleViolations(vehicle.id);
        // Compute active case status based on recent violations
        // A case is considered active if it has not been rejected or closed
        const activeCase = violations.find(v => ['pending_ai_review', 'ai_reviewed', 'verification_queue', 'challan_recommended'].includes(v.status));
        return {
            vehicle: {
                id: vehicle.id,
                registrationNumber: vehicle.registration_number,
                vehicleType: vehicle.vehicle_type,
                ownerName: vehicle.owner_name,
                ownerMobile: vehicle.owner_mobile,
                make: vehicle.make,
                model: vehicle.model,
                color: vehicle.color,
                warningCount: vehicle.warning_count,
            },
            activeCaseStatus: activeCase ? activeCase.status : null,
            warnings: warnings.map(w => ({
                id: w.id,
                warningNumber: w.warningNumber,
                issuedAt: w.issuedAt,
                notes: w.notes,
            })),
            violations: violations.map(v => ({
                id: v.id,
                capturedAt: v.captured_at,
                violationType: v.violation_type,
                status: v.status,
                location: v.location_description,
            })),
        };
    }
    /**
     * Provides hardcoded synthetic data for the demo mode
     * to avoid querying production databases.
     */
    getDemoData(registration) {
        // Generate some believable synthetic data based on the requested registration
        return {
            vehicle: {
                id: 999,
                registrationNumber: registration.toUpperCase(),
                vehicleType: 'two_wheeler',
                ownerName: 'Demo Vehicle Owner',
                ownerMobile: '+91 9999999999',
                make: 'Demo Motors',
                model: 'Demo Model X',
                color: 'Black',
                warningCount: 2,
            },
            activeCaseStatus: 'verification_queue',
            warnings: [
                {
                    id: 101,
                    warningNumber: 1,
                    issuedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
                    notes: 'First warning issued for no helmet'
                },
                {
                    id: 102,
                    warningNumber: 2,
                    issuedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                    notes: 'Second warning for wrong parking'
                }
            ],
            violations: [
                {
                    id: 888,
                    capturedAt: new Date().toISOString(),
                    violationType: 'triple_riding',
                    status: 'verification_queue',
                    location: 'Hazratganj Intersection, Lucknow',
                },
                {
                    id: 887,
                    capturedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                    violationType: 'wrong_parking',
                    status: 'warning_issued',
                    location: 'Gomti Nagar, Lucknow',
                },
                {
                    id: 886,
                    capturedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
                    violationType: 'no_helmet',
                    status: 'warning_issued',
                    location: 'Charbagh Station Road, Lucknow',
                }
            ]
        };
    }
}
exports.SearchService = SearchService;
