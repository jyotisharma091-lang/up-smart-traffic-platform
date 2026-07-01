"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOfficerActivity = exports.getHeatmap = exports.getDashboard = void 0;
const analytics_service_1 = require("./analytics.service");
const getDashboard = async (req, res, next) => {
    try {
        const metrics = await analytics_service_1.AnalyticsService.getDashboardMetrics(req.user.role, req.user.id, req.user.district);
        res.status(200).json({ success: true, data: metrics });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboard = getDashboard;
const getHeatmap = async (req, res, next) => {
    try {
        const heatmapGeoJSON = await analytics_service_1.AnalyticsService.getHeatmapData(req.user.role, req.user.district);
        res.status(200).json({ success: true, data: heatmapGeoJSON });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getHeatmap = getHeatmap;
const getOfficerActivity = async (req, res, next) => {
    try {
        const activity = await analytics_service_1.AnalyticsService.getOfficerActivity(req.user.role === 'DISTRICT_ADMIN' ? req.user.district : undefined);
        res.status(200).json({ success: true, data: activity });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOfficerActivity = getOfficerActivity;
