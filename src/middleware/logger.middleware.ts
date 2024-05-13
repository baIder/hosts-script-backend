import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const LoggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const ip = (req.headers["X-Real-IP"] as string) || req.ip || "unknown ip";
    logger.info(`${req.method} ${req.path} ${ip} ${JSON.stringify(req.body)}`);

    next();
};
