import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const LoggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(
        `${req.method} ${req.path} ${req.ip} ${JSON.stringify(req.body)}`
    );

    next();
};
