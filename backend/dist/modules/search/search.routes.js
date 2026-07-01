"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("./search.controller");
const authenticate_1 = require("../../middleware/authenticate");
const authorize_1 = require("../../middleware/authorize");
const validate_1 = require("../../middleware/validate");
const search_dto_1 = require("./search.dto");
const router = (0, express_1.Router)();
const searchController = new search_controller_1.SearchController();
// GET /api/search/vehicle?registration=UP32AB1234
router.get('/vehicle', authenticate_1.authenticate, (0, authorize_1.authorize)(['traffic_officer', 'district_admin', 'state_admin']), (0, validate_1.validate)(search_dto_1.SearchVehicleDto), (req, res, next) => searchController.searchVehicle(req, res, next));
exports.default = router;
