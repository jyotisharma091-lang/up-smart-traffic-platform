import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;
      if (parsed.body) req.body = parsed.body;
      // Do not reassign req.query or req.params to avoid getter errors
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((e: any) => ({ path: e.path.join('.'), message: e.message })),
        });
      }
      next(error);
    }
  };
};
