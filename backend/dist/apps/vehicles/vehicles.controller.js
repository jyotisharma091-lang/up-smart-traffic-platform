"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehicle = exports.createVehicle = void 0;
const vehicles_service_1 = require("./vehicles.service");
const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicles_service_1.VehicleService.createVehicle(req.body);
        res.status(201).json({ success: true, message: 'Vehicle added successfully', data: vehicle });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createVehicle = createVehicle;
const getVehicle = async (req, res, next) => {
    try {
        const { vehicleNumber } = req.params;
        const vehicleData = await vehicles_service_1.VehicleService.getVehicleByNumber(vehicleNumber);
        res.status(200).json({ success: true, data: vehicleData });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getVehicle = getVehicle;
