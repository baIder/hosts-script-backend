import { zip } from "compressing";
import express from "express";
import * as fs from "node:fs";
import { logger } from "../middleware/logger";

const router = express.Router();

router.post("/gen", async (req, res) => {
    const str = `echo "hello world"`;
    fs.writeFileSync("test.sh", str);
    fs.chmodSync("test.sh", 0o755);
    try {
        await zip.compressFile("test.sh", "test.zip");
        logger.info("Zip file created");
    } catch (e) {
        logger.error(e);
    }
    res.sendFile("test.zip", { root: "." }, (err) => {
        if (err) {
            logger.error(err);
        }
    });
});

export default router;