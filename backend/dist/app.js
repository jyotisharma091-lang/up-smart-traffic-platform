"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Basic health check route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'ATIP Backend is running normally.' });
});
const auth_routes_1 = __importDefault(require("./apps/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./apps/users/users.routes"));
const vehicles_routes_1 = __importDefault(require("./apps/vehicles/vehicles.routes"));
const violations_routes_1 = __importDefault(require("./apps/violations/violations.routes"));
const analytics_routes_1 = __importDefault(require("./apps/analytics/analytics.routes"));
// Mount routes here
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', users_routes_1.default);
app.use('/api/v1/vehicles', vehicles_routes_1.default);
app.use('/api/v1/violations', violations_routes_1.default);
app.use('/api/v1/analytics', analytics_routes_1.default);
// Serve frontend static files
const frontendPath = path_1.default.join(__dirname, '../../frontend/dist');
app.use(express_1.default.static(frontendPath));
// Catch-all route to serve the frontend application
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(frontendPath, 'index.html'));
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
