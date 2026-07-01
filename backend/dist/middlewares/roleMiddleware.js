"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictToDistrict = exports.authorizeRoles = void 0;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
const restrictToDistrict = (req, res, next) => {
    // If the user is STATE_ADMIN, they can bypass district restrictions
    if (req.user && req.user.role === 'STATE_ADMIN') {
        return next();
    }
    if (!req.user || !req.user.district) {
        return res.status(403).json({ success: false, message: 'Forbidden: No district assigned' });
    }
    // Logic here could involve checking `req.params.district` or similar against `req.user.district`
    // For most queries, we will just implicitly use `req.user.district` in the SQL WHERE clause.
    // This middleware is more for explicit endpoint checks if needed.
    next();
};
exports.restrictToDistrict = restrictToDistrict;
