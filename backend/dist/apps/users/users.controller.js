"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.updateUser = exports.getUsers = exports.createUser = void 0;
const users_service_1 = require("./users.service");
const createUser = async (req, res, next) => {
    try {
        const creatorRole = req.user.role;
        const creatorDistrict = req.user.district;
        const user = await users_service_1.UserService.createUser(req.body, creatorRole, creatorDistrict);
        res.status(201).json({ success: true, message: 'User created successfully', data: user });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createUser = createUser;
const getUsers = async (req, res, next) => {
    try {
        const role = req.user.role;
        const district = req.user.district;
        const usersList = await users_service_1.UserService.getUsers(role, district);
        res.status(200).json({ success: true, data: usersList });
    }
    catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};
exports.getUsers = getUsers;
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await users_service_1.UserService.updateUser(id, req.body, req.user.role, req.user.district);
        res.status(200).json({ success: true, message: 'User updated successfully', data: user });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateUser = updateUser;
const resetPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        await users_service_1.UserService.resetPassword(id, newPassword, req.user.role, req.user.district);
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.resetPassword = resetPassword;
