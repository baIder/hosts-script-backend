import express from "express";
import * as fs from "node:fs";
import path from "node:path";
import { getFormattedDate, getFormattedTime } from "../utils/date";
import { logger } from "../utils/logger";
import { genBatScript, genScripts } from "../utils/generate";
import { zip } from "compressing";

const router = express.Router();

router.post("/gen", async (req, res) => {
    let scripts = "\n";
    const { data, type }: { type: "bat" | "shell"; data: Hosts[] } = req.body;
    for (const item of data) {
        scripts += item.ip + " " + item.domain + "\n";
    }
    const str = type === "shell" ? genScripts(scripts) : genBatScript(data);

    const dirName = getFormattedDate();
    const dirPath = path.join(process.cwd(), process.env.SCRIPT_DIR!, dirName);
    const FILENAME = getFormattedTime() + (type === "shell" ? ".sh" : ".bat");

    try {
        fs.accessSync(dirPath, fs.constants.F_OK);
    } catch (e) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
        fs.writeFileSync(path.join(dirPath, FILENAME), str);
        fs.chmodSync(path.join(dirPath, FILENAME), "755");
    } catch (e) {
        logger.error(e);
        res.status(500).send({ message: "服务器错误" });
    }

    zip.compressFile(
        path.join(dirPath, FILENAME),
        path.join(dirPath, `${FILENAME}.zip`)
    ).then(() => {
        res.sendFile(path.join(dirPath, `${FILENAME}.zip`), (err) => {
            if (err) {
                logger.error(err);
                res.status(500).send({ message: "服务器错误" });
            }
        });
        fs.unlinkSync(path.join(dirPath, FILENAME));
    });
});

export default router;
