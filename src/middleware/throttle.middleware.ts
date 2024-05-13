import { Request, Response, NextFunction } from "express";
import redis from "../utils/redis";

export const throttleMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    redis.incr("reqCount");
    next();
};
