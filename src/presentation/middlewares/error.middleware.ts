import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../../domain";

export class ErrorMiddleware {
    static middleware (error: Error | CustomError, _req: Request, res: Response, _next: NextFunction) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: error.message });
    }
}