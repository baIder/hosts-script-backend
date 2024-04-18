import { zip } from "compressing";
import express from "express";
import * as fs from "node:fs";
import { logger } from "../utils/logger";

const router = express.Router();

router.post("/gen", async (req, res) => {
    const str = `echo "hello world"`;
    fs.writeFileSync("/scripts/test.sh", str);
    fs.chmodSync("/scripts/test.sh", 0o755);
    try {
        await zip.compressFile("/scripts/test.sh", "test.zip");
        logger.info("Zip file created");
    } catch (e) {
        logger.error(e);
    }
    res.sendFile("/scripts/test.zip", { root: "." }, (err) => {
        if (err) {
            logger.error(err);
        }
    });
});

export default router;
