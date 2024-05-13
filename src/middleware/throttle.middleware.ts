import { Request, Response, NextFunction } from "express";
import redis from "../utils/redis";
import { logger } from "../utils/logger";

export const throttleMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const ip = (req.headers["X-Real-IP"] as string) || req.ip || "unknown ip";
    try {
        const body = await redis.get(ip);
        if (body) {
            return res.status(429).send("请求提交过多，请30秒后再试");
        }
    } catch (error) {
        logger.error(error);
    }
    redis.set(ip, req.body, "EX", 30);
    next();
};
