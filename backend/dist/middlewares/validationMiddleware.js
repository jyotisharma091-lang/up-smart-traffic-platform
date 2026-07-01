"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            if (parsed.body)
                req.body = parsed.body;
            // Do not reassign req.query or req.params to avoid getter errors
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.issues.map((e) => ({ path: e.path.join('.'), message: e.message })),
                });
            }
            next(error);
        }
    };
};
exports.validate = validate;
