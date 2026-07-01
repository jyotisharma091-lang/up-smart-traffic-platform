"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const search_service_1 = require("./search.service");
const apiResponse_1 = require("../../utils/apiResponse");
class SearchController {
    searchService;
    constructor() {
        this.searchService = new search_service_1.SearchService();
    }
    /**
     * GET /api/search/vehicle
     * Searches for a vehicle by registration number and returns its full history.
     */
    searchVehicle = async (req, res, next) => {
        try {
            const registration = req.query.registration;
            // Determine if we are in demo mode from an injected property on the request
            // This is typically set by the modeGuard middleware
            const isDemo = req.mode === 'demo';
            const result = await this.searchService.getVehicleHistory(registration, isDemo);
            if (!result) {
                return res.status(404).json(apiResponse_1.ApiResponse.error('Vehicle not found in the system. No violations or warnings recorded.'));
            }
            return res.status(200).json(apiResponse_1.ApiResponse.success('Vehicle history retrieved successfully', result));
        }
        catch (error) {
            next(error);
        }
    };
}
exports.SearchController = SearchController;
