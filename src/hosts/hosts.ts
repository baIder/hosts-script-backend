import express from "express";
import * as fs from "node:fs";
import path from "node:path";
import { getFormattedDate, getFormattedTime } from "../utils/date";
import { logger } from "../utils/logger";
import { genScripts } from "../utils/generate";
import { zip } from "compressing";

const router = express.Router();

router.post("/gen", async (req, res) => {
    let scripts = "\n";
    const { data }: { data: { uuid: string; ip: string; domain: string }[] } =
        req.body;
    for (const item of data) {
        scripts += item.ip + " " + item.domain + "\n";
    }
    const str = genScripts(scripts);

    const dirName = getFormattedDate();
    const dirPath = path.join(process.cwd(), process.env.SCRIPT_DIR!, dirName);
    const FILENAME = getFormattedTime();

    try {
        fs.accessSync(dirPath, fs.constants.F_OK);
    } catch (e) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
        fs.writeFileSync(path.join(dirPath, `${FILENAME}.sh`), str);
        fs.chmodSync(path.join(dirPath, `${FILENAME}.sh`), "755");
    } catch (e) {
        logger.error(e);
        res.send("error");
    }

    zip.compressFile(
        path.join(dirPath, `${FILENAME}.sh`),
        path.join(dirPath, `${FILENAME}.zip`)
    ).then(() => {
        res.sendFile(path.join(dirPath, `${FILENAME}.zip`), (err) => {
            if (err) {
                logger.error(err);
                res.send("error");
            }
        });
        fs.unlinkSync(path.join(dirPath, `${FILENAME}.sh`));
    });
});

export default router;
