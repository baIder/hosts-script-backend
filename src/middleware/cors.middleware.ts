import { Request, Response, NextFunction } from "express";

export const CorsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.header("Access-Control-Allow-Origin", "https://hosts.balder.wang/");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    ); // 允许的 HTTP 方法
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // 允许的 HTTP 头
    res.header("Access-Control-Max-Age", "86400"); // 预检请求的缓存时间 (秒)

    // 针对预检请求，直接返回 204 状态码
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
    } else {
        next();
    }
};
