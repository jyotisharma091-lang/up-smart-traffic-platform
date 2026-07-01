"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImage = exports.updateStatus = exports.getViolationById = exports.getVerificationQueue = exports.getViolations = exports.createViolation = void 0;
const violations_service_1 = require("./violations.service");
const createViolation = async (req, res, next) => {
    try {
        const officerId = req.user.id;
        const district = req.user.district;
        const violation = await violations_service_1.ViolationService.createViolation(req.body, officerId, district);
        res.status(201).json({ success: true, message: 'Violation submitted successfully', data: violation });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createViolation = createViolation;
const getViolations = async (req, res, next) => {
    try {
        const violationsData = await violations_service_1.ViolationService.getViolations(req.user.role, req.user.id, req.user.district);
        console.log(`Sending ${violationsData.length} violations for user ${req.user.id} in district ${req.user.district}. Verification queue count: ${violationsData.filter(v => v.status === 'VERIFICATION_QUEUE').length}`);
        res.status(200).json({ success: true, data: violationsData });
    }
    catch (error) {
        console.error('getViolations Error:', error);
        res.status(403).json({ success: false, message: error.message });
    }
};
exports.getViolations = getViolations;
const getVerificationQueue = async (req, res, next) => {
    try {
        if (req.user.role !== 'DISTRICT_ADMIN') {
            throw new Error('Only district admins can access the verification queue');
        }
        const queueData = await violations_service_1.ViolationService.getVerificationQueue(req.user.district);
        res.status(200).json({ success: true, data: queueData });
    }
    catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};
exports.getVerificationQueue = getVerificationQueue;
const getViolationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const violation = await violations_service_1.ViolationService.getViolationById(id, req.user.role, req.user.id, req.user.district);
        res.status(200).json({ success: true, data: violation });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getViolationById = getViolationById;
const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, violationType } = req.body;
        const violation = await violations_service_1.ViolationService.updateStatus(id, status, req.user.id, req.user.role, req.user.district, violationType);
        res.status(200).json({ success: true, message: 'Status updated', data: violation });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateStatus = updateStatus;
const analyzeImage = async (req, res, next) => {
    try {
        const { imageUrl, base64Image } = req.body;
        const aiData = await violations_service_1.ViolationService.analyzeImage(imageUrl, base64Image);
        res.status(200).json({ success: true, data: aiData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.analyzeImage = analyzeImage;
