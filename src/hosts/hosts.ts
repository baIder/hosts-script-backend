import { zip } from "compressing";
import express from "express";
import * as fs from "node:fs";
import { logger } from "../utils/logger";
import { getFormattedDate } from "../utils/date";
import path from "node:path";

const router = express.Router();

router.post("/gen", async (req, res) => {
    const str = `echo "hello world"`;
    const dirName = getFormattedDate();
    const dirPath = path.join(process.cwd(), "scripts", dirName);
    const FILENAME = "test";

    try {
        fs.accessSync(dirPath, fs.constants.F_OK);
    } catch (e) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
        fs.writeFileSync(path.join(dirPath, `${FILENAME}.sh`), str);
    } catch (e) {
        logger.error(e);
        res.send("error");
    }

    try {
        await zip.compressFile(
            path.join(dirPath, `${FILENAME}.sh`),
            path.join(dirPath, `${FILENAME}.zip`)
        );
        logger.info(`${FILENAME}.zip created`);
    } catch (e) {
        logger.error(e);
        res.send("error");
    }

    res.sendFile(
        path.join("scripts", dirName, `${FILENAME}.zip`),
        { root: "." },
        (err) => {
            if (err) {
                logger.error(err);
                res.send("fail");
            }
        }
    );
});

export default router;
